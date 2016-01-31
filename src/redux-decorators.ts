import {createStore} from 'redux';

let reducer = null;
let appStore = null;

function getStore() {
    if (!appStore) {
        appStore = new Promise((resolve) => {
            var interval = setInterval(() => {
                if (reducer) {
                    clearInterval(interval);
                    resolve(createStore(reducer));
                }
            });
        });
    }
    return appStore;
}

export function Reducer(target) {
    console.log('Reducer');
    console.log(target);
    reducer = target.prototype.reducer;
}

export interface IReducer {
    reducer(state, action);
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

export function State(target) {
    console.log('State');
    if (target.stateProperties === undefined) {
            target.stateProperties = [];
    }
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    target.stateProperties = target.stateProperties.concat(args);
    console.log(target.stateProperties);
}

export function Store(...properties) {
    var stateProperties = Array.prototype.slice.call(arguments);
    return function(target) {
        console.log('Store');
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
