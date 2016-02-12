import {getStore, generalBinding} from './store.decorator/general.binding';
import {angular2Binding} from './store.decorator/angular2.binding';
export {getStore};

export interface IStore {
    dispatch(action);
}

export function Store(...stateProperties) {
    return function(target) {
        angular2Binding(generalBinding(target, stateProperties));
    }
}
