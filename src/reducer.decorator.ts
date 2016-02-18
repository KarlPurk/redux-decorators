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
        let filteredActionReducers = actionReducers.filter((r) => r.type === action.type);
        if (filteredActionReducers.length) {
            return filteredActionReducers.reduce((s, r) => Object.assign(s, r.method(s, ...action.data)),  state);
        }
        return state;
    }
}

//------------------------------------------------------------------------------
// Action reducers
//------------------------------------------------------------------------------

export function addActionReducer(type: string, fn: (state: any) => {}) {
    actionReducers.push({
        type: type,
        method: fn
    });
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

let handleActionReducer = function(target: any, method: string) {
    addActionReducer(method, target[method]);
}

let handleRootReducer = function(target: any, methods: string[]):void {
    if (target.prototype.reducer) {
        rootReducer = target.prototype.reducer;
    }
    actionReducers = actionReducers.concat(methods.map((m) => { return {
        type: m,
        method: target.prototype[m]
    }}));
}

export function Reducer(...methods: string[]) {
    return function(target: any, method?: string) {
        if (!target.prototype) {
            handleActionReducer(target, method);
            return;
        }
        handleRootReducer(target, methods);
    }
}
