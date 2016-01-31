import {createStore} from 'redux';

let reducer;
let reducers = [];
let appStore = null;
let reducerInitialState = {};

function getReducer() {
    return reducer || DefaultReducer.prototype.reducer;
}

function getStore() {
    if (!appStore) {
        appStore = new Promise((resolve) => {
            var interval = setInterval(() => {
                if (getReducer()) {
                    clearInterval(interval);
                    resolve(createStore(getReducer()));
                }
            });
        });
    }
    return appStore;
}

export function InitialState(initialState: any) {
    reducerInitialState = initialState;
    console.log('@InitialState: ', initialState);
    return function(target: any) {}
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

export function Reducer(...methods) {
    return function(target) {
        console.log('@ActionReducer: ', target);
        if (target.prototype.reducer) {
            reducer = target.prototype.reducer;
        }
        reducers = reducers.concat(methods.map((m) => { return {
            type: m,
            method: target.prototype[m]
        }}));
    }
}

export interface IStore {
    appStore;
    dispatch(action);
}

export class BaseStore implements IStore {
    appStore;
    dispatch(action) {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        this.appStore.dispatch({type: action, data: args});
    }
}

export function State() {
    return function(target) {
        console.log('@State: ', target);
        if (target.stateProperties === undefined) {
                target.stateProperties = [];
        }
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        target.stateProperties = target.stateProperties.concat(args);
    }
}

export function Store(...properties) {
    var stateProperties = Array.prototype.slice.call(arguments);
    return function(target) {
        console.log('@Store: ', target);
        var existingNgOnInit = target.prototype.ngOnInit;
        var existingNgOnDestroy = target.prototype.ngOnDestroy;
        if (target.prototype.stateProperties === undefined) {
            target.prototype.stateProperties = [];
        }
        if (this instanceof String) {
            target.prototype.stateProperties.push(this);
        }
        target.prototype.stateProperties = target.prototype.stateProperties.concat(stateProperties);
        target.prototype.ngOnInit = function() {
            let storeUpdateHandler = () => {
                let state = this.appStore.getState( );
                this.stateProperties.forEach((prop) => {
                    this[prop] = state[prop];
                });
            };
            getStore().then((appStore) => {
                this.appStore = appStore;
                this.unsubscribe = this.appStore.subscribe(storeUpdateHandler);
                // Apply the default state to all listeners
                storeUpdateHandler();
            });
            !existingNgOnInit || existingNgOnInit();
        }
        target.prototype.ngOnDestroy = function() {
            this.unsubscribe();
            !existingNgOnDestroy || existingNgOnDestroy();
        }
    }
}
