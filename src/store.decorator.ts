import {getStore, generalBinding} from './store.decorator/general.binding';
import {angular2Binding} from './store.decorator/angular2.binding';
export {getStore};

export interface IStore {
    dispatch(action: string);
}

export function Store(...stateProperties: string[]) {
    return function(target: any) {
        angular2Binding(generalBinding(target, stateProperties));
    }
}
