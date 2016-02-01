let reducer;
let reducerInitialState = {};
let reducers = [];

export function setInitialState(initialState) {
    reducerInitialState = initialState;
}

export function getReducer() {
    return reducer || DefaultReducer.prototype.reducer;
}

export interface IReducer {
    reducer(state, action);
}

class DefaultReducer implements IReducer {
    reducer(state = reducerInitialState, action) {
        let actionReducers = reducers.filter((r) => r.type === action.type);
        if (actionReducers.length) {
            return actionReducers.reduce((s, r) => Object.assign(s, r.method(s)), state);
        }
        return state;
    }
}

let handleActionReducer = function(target, methods) {
    reducers.push({
        type: methods[0],
        method: target[methods[0]]
    });
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
