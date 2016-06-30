[![Build Status](https://travis-ci.org/KarlPurk/redux-decorators.svg)](https://travis-ci.org/KarlPurk/redux-decorators)

# Redux Decorators

A ridiculously good syntax for working with Redux using decorators in ES7 / TypeScript.  Currently limited to Angular 2 but could potentially be used elsewhere.

<a href="http://plnkr.co/edit/mhZNwlkrpo7k4rzEQaOr?p=preview" target="_blank">Try a live example on plunkr</a>

# Installation

```
npm i redux-decorators
```

# Example Usage (Angular 2)

**app.reducer.ts**
```js
import {InitialState, Reducer} from 'redux-decorators';

@InitialState({
    count: 0
})
@Reducer('add', 'remove')
export class AppReducer {
    add(state) { return { count: state.count + 1 }; }
    remove(state) { return { count: state.count - 1 }; }
}
```
In the above example we create a new class that will hold our action
reducers.  We then register two action reducers with the `@Reducer('add', 'remove')` decorator.  Anytime an `add` or `remove` action is dispatched the
corresponding method will be called on the `AppReducer` class, allowing the
method to update the state for that particular action.

**count.component.ts**
```js
import {Component} from 'angular2/core';
import {Store} from 'redux-decorators';

@Component({
    selector: 'counter',
    template: `
        <div>Count: {{count}}</div>
        <button (click)="dispatch('add')">Add</button>
        <button (click)="dispatch('remove')">Remove</button>
    `
})

@Store('count')
export class CounterComponent {}
```

In the above example we used the `@Store()` decorator to register the
`CounterComponent` as a store observer.  We also registered the `count` property
with the store which means that any changes to the `count` property in the application
state will be automatically pushed through to the `count` property of this
component.

Notice also the `dispatch()` method in the template.  This method is
 provided by the `@Store()` decorator and can be used to easily dispatch an action.

**boot.ts**
```js
import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import './app.reducer';

bootstrap(AppComponent);
```

In the above example we imported the `app.reducer` as a side-effect only
module - that's all we need to do.

# API

## Decorators

### @InitialState(state: any)

The `@InitialState` decorator is used to set the initial state of a slice in the state tree.

```js
@Slice('count')
@InitialState(0)
@Reducer('increment')
class MyActionReducers {
  increment(count) { return count + 1; } // Initial state is 0 for the count slice
}
```

In the above example the `count` slice of the state tree will be initialized to `0`.  When the `add` reducer is called it will be passed a value of `0`.

This is different to a default value because the default value only takes affect when the reducer is called.  

@InitialState can be used with classes and methods.  You can set an initial state on a class and overwrite the state for individual methods:

```jS
@Slice('count')
@InitialState(0)
@Reducer('increment', 'addItem')
class MyActionReducers {
  increment(count) { return count + 1; } // Initial state is 0 for the count slice

  @Slice('items')
  @InitialState([])
  addItem(items) { return [...items, item]; } // Initial state is [] for the items slice
}
```

It's unlikely that you'll do this, but it's good to understand how this works.  

**Note:** You will be using the `@InitialState` together with the `@Slice` decorator.  It doesn't really make sense to use these decorators apart, which means that we'll likely provide a way to specify these together in a single decorator in the future.

### @Slice(slice: string)

The `@Slice` decorator is used to specify what slice of the state tree action reducers receive.  This allows your action reducers to be passed the data for the slice that they manipulate.

```js
@Slice('count')
@Reducer('increment')
class MyActionReducers {
  increment(count) { return count + 1; } // increment is passed the value of the count slice
}
```

`@Slice` can be used with classes and methods.  Which means a single class of action reducers can work against multiple slices of the state tree.  However, we would advise against this approach.  Action reducer classes should operate on a single slice of the state tree.

```jS
@Slice('count')
@Reducer('increment', 'addItem')
class MyActionReducers {
  increment(count) { return count + 1; } // Initial state is 0 for the count slice

  @Slice('items')
  addItem(items) { return [...items, item]; } // Initial state is [] for the items slice
}
```

In the above example we have used the `@Slice` decorator to specify that the `addItems` reducer should receive the value of the `items` slice from the state tree.

### @Reducer([actionReducer1, actionReducer2, ...])

The `Reducer()` decorator is used to identify a root reducer, however it can also be used as a convenience method for setting multiple action reducers in a single call.

The `@Reducer()` decorator registers a new root reducer if the class you are decorating contains a reducer method.

**Root Reducer**
```js
@Reducer()
class MyRootReducer implements IReducer {
    reducer(state = initialState, action) {
       ...
    }
}
```

In the above example, the `MyRootReducer` class contains a `reducer` method, this means that this `class` will be registered as the root reducer - this will overwrite the default root reducer and prevent action reducers from working out of the box.

**Action Reducers**  
We can mark individual methods as action reducers.
```js
class MyReducers {
    @Reducer() add(state): { return { count: state.count + 1; } }
    @Reducer() remove(state): { return { count: state.count - 1; } }
}
```

Alternatively we can mark multiple methods at once using `@Reducer()`:

```js
@Reducer('add', 'remove')
class MyReducers {
    add(state): { return { count: state.count + 1; } }
    remove(state): { return { count: state.count - 1; } }
}
```

### @Store([stateProp1, stateProp2, ...])

The `@Store()` decorator is used to identify a store component.  A store component is automatically subscribed to the application store and receives registered state updates when the store is updated.

```js
@Store()
class TodoListComponent {
   ...
}
```

You'll also need to declare which properties are updated by the application store. You can do that by explicitly decorating each property with the `@State()` decorator, or you can declare these properties when you declare the `@Store()` decorator:

```js
@Store('todos')
class TodoListComponent {
   ...
}
```

In the above example we are declaring that the `todos` property of the
`TodoListComponent` should be automatically updated whenever the application store's `todos` property is changed.

### @State()

The `@State()` decorator is used to identify a state property in the application store.  Identifying state properties allow the property to be automatically updated when the application store's property changes.

```js
@Store()
class TodoListComponent {
   @State() todos:Todo[] = [];
   ...
}
```

In the above example we are declaring that the `todos` property of the
`TodoListComponent` should be automatically updated whenever the application store's `todos` property is changed.  Please also refer to the `@Store()` equivalent.

# License

MIT
