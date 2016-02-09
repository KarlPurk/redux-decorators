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
    stateProperties;
    unsubscribe;
    dispatch(action);
}

export function updateComponentProperties(component, state, properties = 'stateProperties') {
    component[properties].forEach(prop => {
        component[prop] = state[prop];
    });
}

function mapProperties(context) {
    updateComponentProperties(context, context.appStore.getState())
}

function generalBinding(target, stateProperties) {

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
        updateComponentProperties(this, this.appStore.getState());
    };

    // Add a generic storeInit method
    target.prototype.storeInit = function() {
        getStore().then((appStore) => {
            this.appStore = appStore;
            this.unsubscribe = this.appStore.subscribe(this.storeUpdateHandler);
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

function angular2Binding(target) {
    var existingNgOnInit = target.prototype.ngOnInit;
    var existingNgOnDestroy = target.prototype.ngOnDestroy;
    target.prototype.ngOnInit = function() {
        this.storeInit();
        !existingNgOnInit || existingNgOnInit();
    }
    target.prototype.ngOnDestroy = function() {
        this.storeDestroy();
        !existingNgOnDestroy || existingNgOnDestroy();
    }
}

export function Store(...stateProperties) {
    return function(target) {
        angular2Binding(generalBinding(target, stateProperties));
    }
}
