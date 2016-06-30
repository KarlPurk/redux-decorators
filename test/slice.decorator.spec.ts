import 'es6-shim';
import {expect} from './must';
import {Slice} from '../src/slice.decorator';

describe('@Slice', function() {

    it('must add slice information to a class', function() {
        @Slice('class-slice')
        class Component {}
        expect(Component.prototype.stateSliceAffected.default).to.equal('class-slice');
    });

    it('must add slice information to a method', function() {
        class Component {
            @Slice('method-slice')
            method() {}
        }
        const instance = new Component();
        expect(instance.stateSliceAffected.method).to.equal('method-slice');
    });

    it('must support both class and method slice', function() {
        @Slice('class-slice')
        class Component {
            @Slice('method-slice')
            method1() {}
            method2() {}
        }
        const instance = new Component();
        expect(Component.prototype.stateSliceAffected.default).to.equal('class-slice');
        expect(instance.stateSliceAffected.method1).to.equal('method-slice');
        expect(instance.stateSliceAffected.default).to.equal('class-slice');
    });

});
