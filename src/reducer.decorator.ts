import {Reducer} from 'redux';

let rootReducer: Reducer<any>;
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

export function setReducer(reducer: Reducer<any>): void {
    rootReducer = reducer;
}

export function getReducer(): Reducer<any> {
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

        if (action.type === '@@redux/INIT') {
            return actionReducers.reduce((nextState, reducer) => {
                if (!reducer.owner.getInitialState) {
                    return state;
                }
                const initialState = reducer.owner.getInitialState(reducer.type);
                const slice = reducer.owner.getSlice ? reducer.owner.getSlice(reducer.methodName) : null;
                if (initialState !== undefined && slice) {
                    nextState[slice] = initialState;
                }
                return nextState;
            }, initialState);
        }

        let filteredActionReducers = actionReducers.filter(matchingActionTypeOnly);

        if (!filteredActionReducers.length) {
            return state;
        }

        let createNextState = (state, {owner, methodName}) => {
            const reducer = owner[methodName];
            let slice, nextState;
            slice = owner.getSlice ? owner.getSlice(methodName) : null;
            if (slice) {
                const inputState = state.hasOwnProperty(slice) ? state[slice] : undefined;
                nextState = state;
                nextState[slice] = reducer(inputState, ...action.data);
            }
            else {
                nextState = reducer(state, ...action.data);
            }
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
    owner: any;
    methodName: string;
}

let actionReducers: ActionReducer[] = [];

export function addActionReducer(type: string, owner: any, methodName: string): void {
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
