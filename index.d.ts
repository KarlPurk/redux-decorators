export interface RootReducer {
    reduce(state: any, action: any);
}
export function Slice(slice: string, initialState?: any): Function;
export function InitialState(state: any): Function;
export function Reducer(...name: string[]): Function;
export function Store(...name: string[]): Function;
export interface IStore {
    dispatch(action: string, ...data: any[])
}
