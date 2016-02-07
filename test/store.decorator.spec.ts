import 'es6-shim';
import {sinon} from './sinon';
import {expect} from './must';
import {getStore, createStore, updateComponentProperties, Store} from '../src/store.decorator';
import {setInitialState} from '../src/reducer.decorator';

describe('@Store', function() {

    it('must allow multiple state properties to be bound with @State', function() {

        @Store('one', 'two', 'three')
        class StoreComponent {}
        expect(StoreComponent.prototype.stateProperties).to.contain('one');
        expect(StoreComponent.prototype.stateProperties).to.contain('two');
        expect(StoreComponent.prototype.stateProperties).to.contain('three');

    });

    it('must update local properties to match state', function() {

        let state = {one: 1, two: 2, three: 3};
        @Store('one', 'two', 'three')
        class StoreComponent {}
        updateComponentProperties(StoreComponent.prototype, state)

    });

});
