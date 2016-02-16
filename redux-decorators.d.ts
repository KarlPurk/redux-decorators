declare module ReduxDecorators {
    function InitialState(state: any): Function;
    function Reducer(...name: string[]): Function;
    function Store(...name: string[]): Function;
}

declare module "redux-decorators" {
    export = ReduxDecorators;
}
