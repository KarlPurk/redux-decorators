declare module ReduxDecorators {
    interface RootReducer {
        reduce(state: any, action: any);
    }
    function Slice(slice: string, initialState?: any): Function;
    function InitialState(state: any): Function;
    function Reducer(...name: string[]): Function;
    function Store(...name: string[]): Function;
    interface IStore {
        dispatch(action: string, ...data: any[])
    }
}

declare module "redux-decorators" {
    export = ReduxDecorators;
}
