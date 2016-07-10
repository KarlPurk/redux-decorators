import {setInitialState} from './reducer.decorator';

export function InitialState(initialState: any): Function {
    setInitialState(initialState);
    return function(target: any): void {}
}
