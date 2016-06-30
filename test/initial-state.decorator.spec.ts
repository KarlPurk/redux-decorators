import 'es6-shim';
import {expect} from './must';
import {InitialState} from '../src/initial-state.decorator';

describe('@InitialState', function() {

    it('must add initial state information to a class', function() {
        @InitialState({ count: 1 })
        class Component { }
        expect(Component.prototype.initialState.default).to.eql({ count: 1 });
    });

    it('must add initial state information to a method', function() {
        class Component {
            @InitialState({ count: 1 })
            method() { }
        }
        const instance = new Component();
        expect(instance.initialState.method).to.eql({ count: 1 });
    });

    it('must support both class and method slice', function() {
        @InitialState({ count: 0 })
        class Component {
            @InitialState({ count1: 1 })
            method1() { }
            method2() { }
        }
        const instance = new Component();
        expect(Component.prototype.initialState.default).to.eql({ count: 0 });
        expect(instance.initialState.method1).to.eql({ count1: 1 });
        expect(instance.initialState.default).to.eql({ count: 0 });
    });

});
