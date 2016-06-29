import 'es6-shim';
import {sinon} from './sinon';
import {expect} from './must';
import {Reducer, DefaultReducer, setReducer, addActionReducer, removeActionReducers, getActionReducers} from '../src/reducer.decorator';
import {getStore} from '../src/store.decorator';

describe('@Reducer', function() {

    afterEach(function () {
        removeActionReducers();
    })

    describe('DefaultReducer', function() {

        it('must pass data through to reducer methods', function() {
            let state = {}, values = [1, 'test'], type = 'add';
            let actionReducer = { add: () => {} };
            let defaultReducer = new DefaultReducer();
            let spy = sinon.spy(actionReducer, 'add');
            addActionReducer(type, actionReducer, 'add');
            defaultReducer.reducer(state, {type: type, data: values});
            expect(spy.calledWithExactly(state, values[0], values[1])).to.be.true();
        })

    });

    describe('root reducer', function() {

        it('must pass state and action when calling reducer method', function() {

            @Reducer()
            class RootReducer { reducer(state, action) {} }
            let spy = sinon.spy(RootReducer.prototype, 'reducer');
            getStore().then(function(store) {
                store.dispatch('action', 1, 2, 3);
                expect(spy.calledWithExactly('action', [1, 2, 3]))
            });
            setReducer(null);

        });

    });

    describe('action reducers (class)', function() {

        it('must allow multiple action reducers to be registered with @Reducer', function() {

            @Reducer('one', 'two', 'three')
            class ActionReducers { one() {} two() {} three() {} }
            let [one, two, three] = getActionReducers();

            expect(one).property('type', 'one');
            expect(one).property('owner', ActionReducers.prototype);
            expect(one).property('methodName', 'one');

            expect(two).property('type', 'two');
            expect(two).property('owner', ActionReducers.prototype);
            expect(two).property('methodName', 'two');

            expect(three).property('type', 'three');
            expect(three).property('owner', ActionReducers.prototype);
            expect(three).property('methodName', 'three');

        });

    })

    describe('action reducers (function)', function() {

        it('must allow multiple action reducers to be registered with @Reducer', function() {

            class ActionReducers {
                @Reducer() one() {}
                @Reducer() two() {}
                three() {}
            }
            let [one, two, three] = getActionReducers();

            expect(one).property('type', 'one');
            expect(one).property('owner', ActionReducers.prototype);
            expect(one).property('methodName', 'one');

            expect(two).property('type', 'two');
            expect(two).property('owner', ActionReducers.prototype);
            expect(two).property('methodName', 'two');

            expect(three).be.undefined();

        });

    })

});
