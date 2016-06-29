import 'es6-shim';
import {expect} from './must';
import {Slice} from '../src/slice.decorator';
import {Reducer, DefaultReducer, removeActionReducers} from '../src/reducer.decorator';

describe('@Slice and @Reducer together', function() {

    beforeEach(() => removeActionReducers());

    it('must add slice information to a class', function() {
        @Slice('count')
        @Reducer('add')
        class Component {
            add(count) { return count + 1; }
        }
        let state = {count: 1}, type = 'add';
        let defaultReducer = new DefaultReducer();
        let nextState = defaultReducer.reducer(state, {type: type});
        expect(nextState).property('count', 2);
    });

    it('must use default value when undefined is passed', function() {
        @Slice('count')
        @Reducer('add')
        class Component {
            add(count = 0) { return count + 1; }
        }
        let state = {}, type = 'add';
        let defaultReducer = new DefaultReducer();
        let nextState = defaultReducer.reducer(state, {type: type});
        expect(nextState).property('count', 1);
    });

});
