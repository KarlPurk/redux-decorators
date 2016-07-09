import {InitialState} from './initial-state.decorator';

const addGetSliceMethod = (target) => {
    if (target.getSlice) {
        return;
    }
    target.getSlice = (actionType) => {
        if (!target.stateSliceAffected) {
            return undefined;
        }
        if (target.stateSliceAffected.hasOwnProperty(actionType)) {
            return target.stateSliceAffected[actionType];
        }
        if (target.stateSliceAffected.hasOwnProperty('default')) {
            return target.stateSliceAffected.default;
        }
        return undefined;
    }
};

const addStateSliceAffectedProperty = (target) => {
    if (target.hasOwnProperty('stateSliceAffected')) {
        return;
    }
    target.stateSliceAffected = {};
};

export function Slice(slice: string, initialState?: any): Function {
    return function(target: any, method?: string): void {
        const isInstance = !target.prototype;
        if (isInstance) {
            addStateSliceAffectedProperty(target);
            addGetSliceMethod(target);
            target.stateSliceAffected[method] = slice;
            InitialState(initialState)(target, method);
            return;
        }
        addStateSliceAffectedProperty(target.prototype);
        addGetSliceMethod(target.prototype);
        target.prototype.stateSliceAffected.default = slice;
        InitialState(initialState)(target);
    }
}
