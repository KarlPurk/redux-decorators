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

export function setSliceState(initialState: any, target: any, methodName?: string): void {
    const isInstance = !target.prototype;
    var targetRef = isInstance ? target : target.prototype;
    addInitialStateProperty(targetRef);
    addGetInitialStateMethod(targetRef);
    methodName = methodName ? methodName : 'default';
    targetRef.initialState[methodName] = initialState;
}
