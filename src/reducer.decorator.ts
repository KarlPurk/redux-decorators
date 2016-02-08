let rootReducer;
let initialState = {};
let actionReducers = [];

export function setInitialState(state) {
    initialState = state;
}

export function setReducer(reducer) {
    rootReducer = reducer;
}

// @Test
export function getActionReducers() {
    return actionReducers;
}

export function getReducer() {
    return rootReducer || DefaultReducer.prototype.reducer;
}

export interface IReducer {
    reducer(state, action);
}

// @Test export
export class DefaultReducer implements IReducer {
    reducer(state = initialState, action) {
        let filteredActionReducers = actionReducers.filter((r) => r.type === action.type);
        if (filteredActionReducers.length) {
            return filteredActionReducers.reduce((s, r) => Object.assign(s, r.method(s, ...action.data)),  state);
        }
        return state;
    }
}

export function addActionReducer(type, fn) {
    actionReducers.push({
        type: type,
        method: fn
    });
}

export function removeReducers() {
    actionReducers = [];
}

let handleActionReducer = function(target, method) {
    addActionReducer(method, target[method]);
}

let handleRootReducer = function(target, methods) {
    if (target.prototype.reducer) {
        rootReducer = target.prototype.reducer;
    }
    actionReducers = actionReducers.concat(methods.map((m) => { return {
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
