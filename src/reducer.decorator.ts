let reducer;
let reducerInitialState = {};
let reducers = [];

export function setInitialState(initialState) {
    reducerInitialState = initialState;
}

// @Test
export function getActionReducers() {
    return reducers;
}

export function getReducer() {
    return reducer || DefaultReducer.prototype.reducer;
}

export interface IReducer {
    reducer(state, action);
}

// @Test export
export class DefaultReducer implements IReducer {
    reducer(state = reducerInitialState, action) {
        let actionReducers = reducers.filter((r) => r.type === action.type);
        if (actionReducers.length) {
            return actionReducers.reduce((s, r) => Object.assign(s, r.method(s, ...action.data)),  state);
        }
        return state;
    }
}

// @Test export
export let addReducer = function(type, fn) {
    reducers.push({
        type: type,
        method: fn
    });
}

let handleActionReducer = function(target, methods) {
    addReducer(methods[0], target[methods[0]]);
}

let handleRootReducer = function(target, methods) {
    if (target.prototype.reducer) {
        reducer = target.prototype.reducer;
    }
    reducers = reducers.concat(methods.map((m) => { return {
        type: m,
        method: target.prototype[m]
    }}));
}

export function Reducer(...methods) {
    return function(target) {
        if (!target.prototype) {
            handleActionReducer(target, methods);
            return;
        }
        handleRootReducer(target, methods);
    }
}
