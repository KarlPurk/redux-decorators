
import {createStore} from 'redux';
import {getReducer} from './../reducer.decorator';

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

export function updateStateProperties(target, state, properties = 'stateProperties') {
    target[properties].forEach(prop => {
        target[prop] = state[prop];
    });
}

export function generalBinding(target, stateProperties) {

    // Add stateProperties to the target
    if (target.prototype.stateProperties === undefined) {
        target.prototype.stateProperties = [];
    }
    target.prototype.stateProperties = target.prototype.stateProperties.concat(stateProperties);

    // Add a dispatch method to the target
    target.prototype.dispatch = function(action, ...data) {
        this.appStore.dispatch({type: action, data: data});
    };

    // Add a generic store update handler
    target.prototype.storeUpdateHandler = function() {
        updateStateProperties(this, this.appStore.getState());
    };

    // Add a generic storeInit method
    target.prototype.storeInit = function() {
        getStore().then((store) => {
            this.appStore = store;
            this.unsubscribe = this.appStore.subscribe(this.storeUpdateHandler.bind(this));
            // Apply the default state to all listeners
            this.storeUpdateHandler();
        });
    }

    // Add a generic storeDestroy method
    target.prototype.storeDestroy = function() {
        this.unsubscribe();
    };

    return target;
}
