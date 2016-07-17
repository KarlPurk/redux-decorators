import 'es6-shim';
import * as expect from 'must';
import { setSliceState } from '../src/slice-state.helper';

describe('slice state helper', function() {

    it('must add initial state information to a class', function() {
        class Component { initialState: any };
        setSliceState({count: 1}, Component);
        expect(Component.prototype.initialState.default).to.eql({ count: 1 });
    });

    it('must add initial state information to a method', function() {
        class Component {
            initialState: any;
            method() { }
        }
        setSliceState({ count: 1 }, Component, 'method');
        const instance = new Component();
        expect(instance.initialState.method).to.eql({ count: 1 });
    });

    it('must support both class and method slice', function() {
        class Component {
            initialState: any;
            method1() { }
            method2() { }
        }
        setSliceState({ count: 0 }, Component);
        setSliceState({ count1: 1 }, Component, 'method1');
        const instance = new Component();
        expect(Component.prototype.initialState.default).to.eql({ count: 0 });
        expect(instance.initialState.method1).to.eql({ count1: 1 });
        expect(instance.initialState.default).to.eql({ count: 0 });
    });

});
