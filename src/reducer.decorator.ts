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

export function addReducer(type, fn) {
    reducers.push({
        type: type,
        method: fn
    });
}

export function removeReducers() {
    reducers = [];
}

let handleActionReducer = function(target, method) {
    addReducer(method, target[method]);
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
    return function(target, method) {
        if (!target.prototype) {
            handleActionReducer(target, method);
            return;
        }
        handleRootReducer(target, methods);
    }
}
