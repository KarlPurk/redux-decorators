(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("redux"));
	else if(typeof define === 'function' && define.amd)
		define(["redux"], factory);
	else if(typeof exports === 'object')
		exports["ReduxDecorators"] = factory(require("redux"));
	else
		root["ReduxDecorators"] = factory(root["redux"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__) {
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
	var initial_state_decorator_1 = __webpack_require__(5);
	exports.InitialState = initial_state_decorator_1.InitialState;
	// reducer decorator module exports
	// state decorator module exports
	// store decorator module exports
	// initial-state decorator module exports


/***/ },
/* 1 */
/***/ function(module, exports) {

	var rootReducer;
	var initialState = {};
	var actionReducers = [];
	//------------------------------------------------------------------------------
	// Initial state
	//------------------------------------------------------------------------------
	function setInitialState(state) {
	    initialState = state;
	}
	exports.setInitialState = setInitialState;
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
	        var filteredActionReducers = actionReducers.filter(function (r) { return r.type === action.type; });
	        if (filteredActionReducers.length) {
	            return filteredActionReducers.reduce(function (s, r) { return Object.assign(s, r.method.apply(r, [s].concat(action.data))); }, state);
	        }
	        return state;
	    };
	    return DefaultReducer;
	})();
	exports.DefaultReducer = DefaultReducer;
	//------------------------------------------------------------------------------
	// Action reducers
	//------------------------------------------------------------------------------
	function addActionReducer(type, fn) {
	    actionReducers.push({
	        type: type,
	        method: fn
	    });
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
	var handleActionReducer = function (target, method) {
	    addActionReducer(method, target[method]);
	};
	var handleRootReducer = function (target, methods) {
	    if (target.prototype.reducer) {
	        rootReducer = target.prototype.reducer;
	    }
	    actionReducers = actionReducers.concat(methods.map(function (m) {
	        return {
	            type: m,
	            method: target.prototype[m]
	        };
	    }));
	};
	function Reducer() {
	    var methods = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        methods[_i - 0] = arguments[_i];
	    }
	    return function (target, method) {
	        if (!target.prototype) {
	            handleActionReducer(target, method);
	            return;
	        }
	        handleRootReducer(target, methods);
	    };
	}
	exports.Reducer = Reducer;


/***/ },
/* 2 */
/***/ function(module, exports) {

	function State() {
	    return function (target) {
	        console.log('@State: ', target);
	        if (target.stateProperties === undefined) {
	            target.stateProperties = [];
	        }
	        var args = Array.prototype.slice.call(arguments);
	        args.shift();
	        target.stateProperties = target.stateProperties.concat(args);
	    };
	}
	exports.State = State;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var redux_1 = __webpack_require__(4);
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
	// @Test export
	function updateComponentProperties(component, state, properties) {
	    if (properties === void 0) { properties = 'stateProperties'; }
	    component[properties].forEach(function (prop) {
	        component[prop] = state[prop];
	    });
	}
	exports.updateComponentProperties = updateComponentProperties;
	function Store() {
	    var stateProperties = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        stateProperties[_i - 0] = arguments[_i];
	    }
	    return function (target) {
	        var existingNgOnInit = target.prototype.ngOnInit;
	        var existingNgOnDestroy = target.prototype.ngOnDestroy;
	        if (target.prototype.stateProperties === undefined) {
	            target.prototype.stateProperties = [];
	        }
	        target.prototype.stateProperties = target.prototype.stateProperties.concat(stateProperties);
	        target.prototype.ngOnInit = function () {
	            var _this = this;
	            var storeUpdateHandler = function () {
	                updateComponentProperties(_this, _this.appStore.getState());
	            };
	            getStore().then(function (appStore) {
	                _this.appStore = appStore;
	                _this.unsubscribe = _this.appStore.subscribe(storeUpdateHandler);
	                // Apply the default state to all listeners
	                storeUpdateHandler();
	            });
	            !existingNgOnInit || existingNgOnInit();
	        };
	        target.prototype.dispatch = function (action) {
	            var data = [];
	            for (var _i = 1; _i < arguments.length; _i++) {
	                data[_i - 1] = arguments[_i];
	            }
	            this.appStore.dispatch({ type: action, data: data });
	        };
	        target.prototype.ngOnDestroy = function () {
	            this.unsubscribe();
	            !existingNgOnDestroy || existingNgOnDestroy();
	        };
	    };
	}
	exports.Store = Store;


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("redux");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var reducer_decorator_1 = __webpack_require__(1);
	function InitialState(initialState) {
	    reducer_decorator_1.setInitialState(initialState);
	    console.log('@InitialState: ', initialState);
	    return function (target) { };
	}
	exports.InitialState = InitialState;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=redux-decorators.js.map