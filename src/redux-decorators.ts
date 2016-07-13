/// <reference path="../typings/index.d.ts" />

import {Reducer, RootReducer} from './reducer.decorator';
import {State} from './state.decorator';
import {IStore, Store} from './store.decorator';
import {InitialState} from './initial-state.decorator';
export {Slice} from './slice.decorator';

// reducer decorator module exports
export {RootReducer};
export {Reducer};

// state decorator module exports
export {State};

// store decorator module exports
export {Store};
export {IStore};

// initial-state decorator module exports
export {InitialState};
