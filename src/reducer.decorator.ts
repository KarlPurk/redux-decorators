import {Reducer} from 'redux';

let rootReducer: Reducer;
let initialState: any = {};
let actionReducers: any[] = [];

//------------------------------------------------------------------------------
// Initial state
//------------------------------------------------------------------------------

export function setInitialState(state: any) {
    initialState = state;
}

//------------------------------------------------------------------------------
// Root reducer
//------------------------------------------------------------------------------

export function setReducer(reducer: Reducer) {
    rootReducer = reducer;
}

export function getReducer(): Reducer {
    return rootReducer || DefaultReducer.prototype.reducer;
}

export interface RootReducer {
    prototype?: any;// I shouldn't need this
    reducer(state: any, action: any);
}

export class DefaultReducer implements RootReducer {
    reducer(state: any = initialState, action: any) {

        let matchingActionTypeOnly = (actionReducer) => {
            return actionReducer.type === action.type;
        };

        // Filter reducers down to those that match action.type
        let filteredActionReducers = actionReducers.filter(matchingActionTypeOnly);

        // If we don't have any action reducers return the unmutated state
        if (!filteredActionReducers.length) {
            return state;
        }

        let mutateState = (state, actionReducer) => {
            let mutatedState = actionReducer.fn(state, ...action.data);
            return Object.assign(state, mutatedState);
        }

        // Pass the state to each action reducer allowing each to mutate
        // the state.
        return filteredActionReducers.reduce(mutateState, state);
    }
}

//------------------------------------------------------------------------------
// Action reducers
//------------------------------------------------------------------------------

export function addActionReducer(type: string, fn: (state: any) => {}) {
    actionReducers.push({type, fn});
}

export function getActionReducers(): ((state: any) => {})[] {
    return actionReducers;
}

export function removeActionReducers(): void {
    actionReducers = [];
}

//------------------------------------------------------------------------------
// Decorator
//------------------------------------------------------------------------------

let handleActionReducer = function(target: any, type: string) {
    addActionReducer(type, target[type]);
}

let handleRootReducer = function(target: any, types: string[]):void {
    if (target.prototype.reducer) {
        rootReducer = target.prototype.reducer;
    }
    let mapTypes = (type) => { return { type, fn: target.prototype[type] } };
    actionReducers = actionReducers.concat(types.map(mapTypes));
}

export function Reducer(...types: string[]) {
    return function(target: any, type?: string) {
        if (!target.prototype) {
            handleActionReducer(target, type);
            return;
        }
        handleRootReducer(target, types);
    }
}
