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

	var reducer_decorator_1 = __webpack_require__(1);
	exports.Reducer = reducer_decorator_1.Reducer;
	var state_decorator_1 = __webpack_require__(2);
	exports.State = state_decorator_1.State;
	var store_decorator_1 = __webpack_require__(3);
	exports.Store = store_decorator_1.Store;
	var initial_state_decorator_1 = __webpack_require__(7);
	exports.InitialState = initial_state_decorator_1.InitialState;


/***/ },
/* 1 */
/***/ function(module, exports) {

	var rootReducer;
	var initialState = {};
	var actionReducers = [];
	function setInitialState(state) {
	    initialState = state;
	}
	exports.setInitialState = setInitialState;
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
	        var filteredActionReducers = actionReducers.filter(matchingActionTypeOnly);
	        if (!filteredActionReducers.length) {
	            return state;
	        }
	        var mutateState = function (state, actionReducer) {
	            var mutatedState = actionReducer.fn.apply(actionReducer, [state].concat(action.data));
	            return Object.assign(state, mutatedState);
	        };
	        return filteredActionReducers.reduce(mutateState, state);
	    };
	    return DefaultReducer;
	})();
	exports.DefaultReducer = DefaultReducer;
	function addActionReducer(type, fn) {
	    actionReducers.push({ type: type, fn: fn });
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
	var handleActionReducer = function (target, type) {
	    addActionReducer(type, target[type]);
	};
	var handleRootReducer = function (target, types) {
	    if (target.prototype.reducer) {
	        rootReducer = target.prototype.reducer;
	    }
	    var mapTypes = function (type) { return { type: type, fn: target.prototype[type] }; };
	    actionReducers = actionReducers.concat(types.map(mapTypes));
	};
	function Reducer() {
	    var types = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        types[_i - 0] = arguments[_i];
	    }
	    return function (target, type) {
	        if (!target.prototype) {
	            handleActionReducer(target, type);
	            return;
	        }
	        handleRootReducer(target, types);
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
	    if (target.prototype.stateProperties === undefined) {
	        target.prototype.stateProperties = [];
	    }
	    target.prototype.stateProperties = target.prototype.stateProperties.concat(stateProperties);
	    target.prototype.dispatch = function (action) {
	        var data = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            data[_i - 1] = arguments[_i];
	        }
	        this.appStore.dispatch({ type: action, data: data });
	    };
	    target.prototype.storeUpdateHandler = function () {
	        updateStateProperties(this, this.appStore.getState());
	    };
	    target.prototype.storeInit = function () {
	        var _this = this;
	        return this.getStore().then(function () {
	            _this.unsubscribe = _this.appStore.subscribe(_this.storeUpdateHandler.bind(_this));
	            _this.storeUpdateHandler();
	        });
	    };
	    target.prototype.storeDestroy = function () {
	        this.unsubscribe();
	    };
	    target.prototype.getStore = function () {
	        var _this = this;
	        if (this.appStore) {
	            return this.appStore.then ? this.appStore : Promise.resolve(this.appStore);
	        }
	        return getStore().then(function (store) { return _this.appStore = store; });
	    };
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
/***/ function(module, exports, __webpack_require__) {

	var reducer_decorator_1 = __webpack_require__(1);
	function InitialState(initialState) {
	    reducer_decorator_1.setInitialState(initialState);
	    return function (target) { };
	}
	exports.InitialState = InitialState;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=redux-decorators.js.map