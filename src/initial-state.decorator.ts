import {setInitialState} from './reducer.decorator';

export function InitialState(initialState: any) {
    setInitialState(initialState);
    console.log('@InitialState: ', initialState);
    return function(target: any) {}
}
