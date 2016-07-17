import 'es6-shim';
import {spy, stub} from 'sinon';
import * as expect from 'must';
import {generalBinding} from '../../src/store.decorator/general.binding';

describe('generalBinding', function() {

    describe('stateProperties', function() {

        it('must add state properties to the target', function() {
            let target = class Target {};
            let props = ['one', 'two'];
            let output = generalBinding(target, props);
            expect(output.prototype.stateProperties).include('one');
            expect(output.prototype.stateProperties).include('two');
        });

    });

    describe('dispatch', function() {

        it('must add a dispatch method to the target', function() {
            let target = function() {};
            let output = generalBinding(target);
            expect(output.prototype.dispatch).a.function();
        });

    });

    describe('storeHandler', function() {

        it('must add a storeUpdateHandler method to the target', function() {
            let target = function() {};
            let output = generalBinding(target);
            expect(output.prototype.storeUpdateHandler).to.be.function();
        });

        it('must update state properties when called', function() {
            let appStore = {getState(){}};
            let props = ['one', 'two'];
            let state = {one: 1, two: 2};
            stub(appStore, 'getState').returns(state);
            let target = function() { this.appStore = appStore; };
            let output = generalBinding(target, ['one', 'two']);
            let instance = new output();
            instance.storeUpdateHandler();
            expect(instance.one).to.equal(1);
            expect(instance.two).to.equal(2);
        });

    });

    describe('storeInit', function() {

        it('must add a storeInit method to the target', function() {
            let target = function() {};
            let output = generalBinding(target);
            expect(output.prototype.storeInit).to.be.function();
        });

        it('must subscribe to appStore when called', function(done) {
            let target = function() {};
            let output = generalBinding(target);
            let instance = new output();
            let store: any = {subscribe(){}};
            spy(store, 'subscribe');
            // Don't know why spy doesn't work...
            // spy(instance, 'storeUpdateHandler');
            stub(instance, 'storeUpdateHandler');
            instance.setStore(store);
            instance.storeInit().then(() => {
                expect(store.subscribe.calledOnce).to.be.true();
                done();
            })
            .catch(done);
        });

        it('must add an unsubscribe method when called', function(done) {
            let target = function() {};
            let output = generalBinding(target);
            let instance = new output();
            let store = {subscribe(){}};
            stub(store, 'subscribe').returns(function() {});
            // Don't know why spy doesn't work...
            // spy(instance, 'storeUpdateHandler');
            stub(instance, 'storeUpdateHandler');
            instance.setStore(store);
            instance.storeInit().then(() => {
                expect(instance.unsubscribe).to.be.function();
                done();
            })
            .catch(done);
        });


        it('must call the updateStoreHandler when called', function(done) {
            let target = function() {};
            let output = generalBinding(target);
            let instance = new output();
            let store = {subscribe(){}};
            spy(store, 'subscribe');
            // Don't know why spy doesn't work...
            // spy(instance, 'storeUpdateHandler');
            stub(instance, 'storeUpdateHandler');
            instance.setStore(store);
            instance.storeInit().then(() => {
                expect(instance.storeUpdateHandler.calledOnce).to.be.true();
                done();
            })
            .catch(done);
        });


    });

    describe('storeDestroy', function() {

        it('must add a storeDestroy method to the target', function() {
            let target = function() {};
            let output = generalBinding(target);
            expect(output.prototype.storeDestroy).to.be.function();
        });

        it('must call unsubscribe on the appStore when called', function() {
            let target = function() { this.unsubscribe = () => {} };
            let output = generalBinding(target);
            let instance = new output();
            spy(instance, 'unsubscribe');
            instance.storeDestroy();
            expect(instance.unsubscribe.calledOnce).to.be.true();
        });

    });

});
