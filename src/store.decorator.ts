import {createStore} from 'redux';
import {getReducer} from './reducer.decorator';

let appStore;

export function getStore() {
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
