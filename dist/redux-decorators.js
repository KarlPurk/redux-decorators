(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("redux"));
	else if(typeof define === 'function' && define.amd)
		define(["redux"], factory);
	else if(typeof exports === 'object')
		exports["ReduxDecorators"] = factory(require("redux"));
	else
		root["ReduxDecorators"] = factory(root["redux"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../typings/tsd.d.ts" />
	var reducer_decorator_1 = __webpack_require__(1);
	exports.Reducer = reducer_decorator_1.Reducer;
	var state_decorator_1 = __webpack_require__(2);
	exports.State = state_decorator_1.State;
	var store_decorator_1 = __webpack_require__(3);
	exports.Store = store_decorator_1.Store;
	var initial_state_decorator_1 = __webpack_require__(7);
	exports.InitialState = initial_state_decorator_1.InitialState;
	var slice_decorator_1 = __webpack_require__(8);
	exports.Slice = slice_decorator_1.Slice;
	// reducer decorator module exports
	// state decorator module exports
	// store decorator module exports
	// initial-state decorator module exports


/***/ },
/* 1 */
/***/ function(module, exports) {

	var rootReducer;
	var initialState = {};
	//------------------------------------------------------------------------------
	// Root reducer
	//------------------------------------------------------------------------------
	function setReducer(reducer) {
	    rootReducer = reducer;
	}
	exports.setReducer = setReducer;
	function getReducer() {
	    return rootReducer || DefaultReducer.prototype.reducer;
	}
	exports.getReducer = getReducer;
	var DefaultReducer = (function () {
	    function DefaultReducer() {
	    }
	    DefaultReducer.prototype.reducer = function (state, action) {
	        if (state === void 0) { state = initialState; }
	        var matchingActionTypeOnly = function (actionReducer) {
	            return actionReducer.type === action.type;
	        };
	        if (action.type === '@@redux/INIT') {
	            return actionReducers.reduce(function (nextState, reducer) {
	                if (!reducer.owner.getInitialState) {
	                    return state;
	                }
	                var initialState = reducer.owner.getInitialState(reducer.type);
	                var slice = reducer.owner.getSlice ? reducer.owner.getSlice(reducer.methodName) : null;
	                if (initialState !== undefined && slice) {
	                    nextState[slice] = initialState;
	                }
	                return nextState;
	            }, initialState);
	        }
	        var filteredActionReducers = actionReducers.filter(matchingActionTypeOnly);
	        if (!filteredActionReducers.length) {
	            return state;
	        }
	        var createNextState = function (state, _a) {
	            var owner = _a.owner, methodName = _a.methodName;
	            var reducer = owner[methodName];
	            var slice, nextState;
	            slice = owner.getSlice ? owner.getSlice(methodName) : null;
	            if (slice) {
	                var inputState = state.hasOwnProperty(slice) ? state[slice] : undefined;
	                nextState = state;
	                nextState[slice] = reducer.apply(void 0, [inputState].concat(action.data));
	            }
	            else {
	                nextState = reducer.apply(void 0, [state].concat(action.data));
	            }
	            return Object.assign(state, nextState);
	        };
	        return filteredActionReducers.reduce(createNextState, state);
	    };
	    return DefaultReducer;
	})();
	exports.DefaultReducer = DefaultReducer;
	var actionReducers = [];
	function addActionReducer(type, owner, methodName) {
	    actionReducers.push({ type: type, owner: owner, methodName: methodName });
	}
	exports.addActionReducer = addActionReducer;
	function getActionReducers() {
	    return actionReducers;
	}
	exports.getActionReducers = getActionReducers;
	function removeActionReducers() {
	    actionReducers = [];
	}
	exports.removeActionReducers = removeActionReducers;
	//------------------------------------------------------------------------------
	// Decorator
	//------------------------------------------------------------------------------
	var handleActionReducer = function (owner, methodName) {
	    addActionReducer(methodName, owner, methodName);
	};
	var handleRootReducer = function (owner, methodNames) {
	    if (owner.prototype.reducer) {
	        rootReducer = owner.prototype.reducer;
	    }
	    var mapMethodNames = function (methodName) { return { type: methodName, owner: owner.prototype, methodName: methodName }; };
	    actionReducers = actionReducers.concat(methodNames.map(mapMethodNames));
	};
	function Reducer() {
	    var methodNames = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        methodNames[_i - 0] = arguments[_i];
	    }
	    return function (owner, methodName) {
	        if (!owner.prototype) {
	            handleActionReducer(owner, methodName);
	            return;
	        }
	        handleRootReducer(owner, methodNames);
	    };
	}
	exports.Reducer = Reducer;


/***/ },
/* 2 */
/***/ function(module, exports) {

	function State() {
	    return function (target) {
	        var props = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            props[_i - 1] = arguments[_i];
	        }
	        if (target.stateProperties === undefined) {
	            target.stateProperties = [];
	        }
	        if (props.length) {
	            target.stateProperties = target.stateProperties.concat(props);
	        }
	    };
	}
	exports.State = State;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var general_binding_1 = __webpack_require__(4);
	exports.getStore = general_binding_1.getStore;
	var angular2_binding_1 = __webpack_require__(6);
	function Store() {
	    var stateProperties = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        stateProperties[_i - 0] = arguments[_i];
	    }
	    return function (target) {
	        angular2_binding_1.angular2Binding(general_binding_1.generalBinding(target, stateProperties));
	    };
	}
	exports.Store = Store;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var redux_1 = __webpack_require__(5);
	var reducer_decorator_1 = __webpack_require__(1);
	var appStore;
	function getStore() {
	    if (!appStore) {
	        appStore = new Promise(function (resolve) {
	            var interval = setInterval(function () {
	                if (reducer_decorator_1.getReducer()) {
	                    clearInterval(interval);
	                    resolve(redux_1.createStore(reducer_decorator_1.getReducer()));
	                }
	            });
	        });
	    }
	    return appStore;
	}
	exports.getStore = getStore;
	function updateStateProperties(target, state, properties) {
	    if (properties === void 0) { properties = 'stateProperties'; }
	    target[properties].forEach(function (prop) {
	        target[prop] = state[prop];
	    });
	}
	exports.updateStateProperties = updateStateProperties;
	function generalBinding(target, stateProperties) {
	    // Add stateProperties to the target
	    if (target.prototype.stateProperties === undefined) {
	        target.prototype.stateProperties = [];
	    }
	    target.prototype.stateProperties = target.prototype.stateProperties.concat(stateProperties);
	    // Add a dispatch method to the target
	    target.prototype.dispatch = function (action) {
	        var data = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            data[_i - 1] = arguments[_i];
	        }
	        this.appStore.dispatch({ type: action, data: data });
	    };
	    // Add a generic store update handler
	    target.prototype.storeUpdateHandler = function () {
	        updateStateProperties(this, this.appStore.getState());
	    };
	    // Add a generic storeInit method
	    target.prototype.storeInit = function () {
	        var _this = this;
	        return this.getStore().then(function () {
	            _this.unsubscribe = _this.appStore.subscribe(_this.storeUpdateHandler.bind(_this));
	            // Apply the default state to all listeners
	            _this.storeUpdateHandler();
	        });
	    };
	    // Add a generic storeDestroy method
	    target.prototype.storeDestroy = function () {
	        this.unsubscribe();
	    };
	    // Add a get store method
	    target.prototype.getStore = function () {
	        var _this = this;
	        if (this.appStore) {
	            return this.appStore.then ? this.appStore : Promise.resolve(this.appStore);
	        }
	        return getStore().then(function (store) { return _this.appStore = store; });
	    };
	    // Add a set store method for testing purposes
	    target.prototype.setStore = function (store) {
	        this.appStore = store;
	    };
	    return target;
	}
	exports.generalBinding = generalBinding;


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("redux");

/***/ },
/* 6 */
/***/ function(module, exports) {

	function angular2Binding(target) {
	    var existingNgOnInit = target.prototype.ngOnInit;
	    var existingNgOnDestroy = target.prototype.ngOnDestroy;
	    target.prototype.ngOnInit = function () {
	        this.storeInit();
	        !existingNgOnInit || existingNgOnInit.call(this);
	    };
	    target.prototype.ngOnDestroy = function () {
	        this.storeDestroy();
	        !existingNgOnDestroy || existingNgOnDestroy.call(this);
	    };
	    return target;
	}
	exports.angular2Binding = angular2Binding;


/***/ },
/* 7 */
/***/ function(module, exports) {

	var addGetInitialStateMethod = function (target) {
	    if (target.getInitialState) {
	        return;
	    }
	    target.getInitialState = function (actionType) {
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
	    };
	};
	var addInitialStateProperty = function (target) {
	    if (target.hasOwnProperty('initialState')) {
	        return;
	    }
	    target.initialState = {};
	};
	function InitialState(initialState) {
	    return function (target, methodName) {
	        var isInstance = !target.prototype;
	        if (isInstance) {
	            addInitialStateProperty(target);
	            addGetInitialStateMethod(target);
	            target.initialState[methodName] = initialState;
	            return;
	        }
	        addInitialStateProperty(target.prototype);
	        addGetInitialStateMethod(target.prototype);
	        target.prototype.initialState.default = initialState;
	    };
	}
	exports.InitialState = InitialState;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var initial_state_decorator_1 = __webpack_require__(7);
	var addGetSliceMethod = function (target) {
	    if (target.getSlice) {
	        return;
	    }
	    target.getSlice = function (actionType) {
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
	    };
	};
	var addStateSliceAffectedProperty = function (target) {
	    if (target.hasOwnProperty('stateSliceAffected')) {
	        return;
	    }
	    target.stateSliceAffected = {};
	};
	function Slice(slice, initialState) {
	    return function (target, method) {
	        var isInstance = !target.prototype;
	        if (isInstance) {
	            addStateSliceAffectedProperty(target);
	            addGetSliceMethod(target);
	            target.stateSliceAffected[method] = slice;
	            initial_state_decorator_1.InitialState(initialState)(target, method);
	            return;
	        }
	        addStateSliceAffectedProperty(target.prototype);
	        addGetSliceMethod(target.prototype);
	        target.prototype.stateSliceAffected.default = slice;
	        initial_state_decorator_1.InitialState(initialState)(target);
	    };
	}
	exports.Slice = Slice;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=redux-decorators.js.map