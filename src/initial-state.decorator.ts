const addGetInitialStateMethod = (target) => {
    if (target.getInitialState) {
        return;
    }
    target.getInitialState = (actionType) => {
        if (!target.initialState) {
            return undefined;
        }
        if (target.initialState.hasOwnProperty(actionType)) {
            return target.initialState[actionType];
        }
        if (target.initialState.hasOwnProperty('default')) {
            return target.initialState.default;
        }
        return undefined;
    }
};

const addInitialStateProperty = (target) => {
    if (target.hasOwnProperty('initialState')) {
        return;
    }
    target.initialState = {};
};

export function InitialState(initialState: any): Function {
    return function(target: any, methodName?: string): void {
        const isInstance = !target.prototype;
        if (isInstance) {
            addInitialStateProperty(target);
            addGetInitialStateMethod(target);
            target.initialState[methodName] = initialState;
            return;
        }
        addInitialStateProperty(target.prototype);
        addGetInitialStateMethod(target.prototype);
        target.prototype.initialState.default = initialState;
    }
}
