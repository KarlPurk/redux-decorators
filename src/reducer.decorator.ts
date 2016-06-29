import {Reducer} from 'redux';

let rootReducer: Reducer;
let initialState: any = {};

//------------------------------------------------------------------------------
// Initial state
//------------------------------------------------------------------------------

export function setInitialState(state: any): any {
    initialState = state;
}

//------------------------------------------------------------------------------
// Root reducer
//------------------------------------------------------------------------------

export function setReducer(reducer: Reducer): void {
    rootReducer = reducer;
}

export function getReducer(): Reducer {
    return rootReducer || DefaultReducer.prototype.reducer;
}

export interface RootReducer {
    prototype?: any;// I shouldn't need this
    reducer(state: any, action: any): any;
}

export class DefaultReducer implements RootReducer {
    reducer(state: any = initialState, action: any): any {

        let matchingActionTypeOnly = (actionReducer) => {
            return actionReducer.type === action.type;
        };

        let filteredActionReducers = actionReducers.filter(matchingActionTypeOnly);

        if (!filteredActionReducers.length) {
            return state;
        }

        let createNextState = (state, {owner, methodName}) => {
            const reducer = owner[methodName];
            const nextState = reducer(state, ...action.data);
            return Object.assign(state, nextState);
        }

        return filteredActionReducers.reduce(createNextState, state);
    }
}

//------------------------------------------------------------------------------
// Action reducers
//------------------------------------------------------------------------------

interface ActionReducer {
    type: string;
    owner: Function;
    methodName: string;
}

let actionReducers: ActionReducer[] = [];

export function addActionReducer(type: string, owner: Function, methodName: string): void {
    actionReducers.push({type, owner, methodName});
}

export function getActionReducers(): ActionReducer[] {
    return actionReducers;
}

export function removeActionReducers(): void {
    actionReducers = [];
}

//------------------------------------------------------------------------------
// Decorator
//------------------------------------------------------------------------------

let handleActionReducer = function(owner: any, methodName: string): void {
    addActionReducer(methodName, owner, methodName);
}

let handleRootReducer = function(owner: any, methodNames: string[]): void {
    if (owner.prototype.reducer) {
        rootReducer = owner.prototype.reducer;
    }
    let mapMethodNames = (methodName) => { return { type: methodName, owner: owner.prototype, methodName } };
    actionReducers = actionReducers.concat(methodNames.map(mapMethodNames));
}

export function Reducer(...methodNames: string[]): Function {
    return function(owner: any, methodName?: string): void {
        if (!owner.prototype) {
            handleActionReducer(owner, methodName);
            return;
        }
        handleRootReducer(owner, methodNames);
    }
}
