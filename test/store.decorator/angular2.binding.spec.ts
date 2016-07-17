/// <reference path="../../typings/index.d.ts" />

import 'es6-shim';
import {spy, stub} from 'sinon';
import * as expect from 'must';
import {angular2Binding} from '../../src/store.decorator/angular2.binding';

describe('angular2Binding', function() {

    describe('ngOnInut', function() {

        it('must add ngOnInit method to the target', function() {
            let target = function() {};
            let output = angular2Binding(target);
            expect(output.prototype.ngOnInit).a.function();
        });

        it('must call storeInit method when called', function() {
            let target = function() {};
            target.prototype.storeInit = spy();
            let output = angular2Binding(target);
            let instance = new output()
            instance.ngOnInit();
            expect(instance.storeInit.calledOnce).to.be.true();
        });

        it('must call the existing ngOnInit method when called', function() {
            let target = function() {};
            let existingNgOnInit = spy();
            target.prototype.storeInit = stub();
            target.prototype.ngOnInit = existingNgOnInit;
            let output = angular2Binding(target);
            let instance = new output()
            instance.ngOnInit();
            expect(existingNgOnInit.calledOnce).to.be.true();
        });

        it('must call the existing ngOnInit with the correct context', function() {
            let target = function() { this.called = false; };
            let existingNgOnInit = function() { this.called = true; };
            target.prototype.storeInit = stub();
            target.prototype.ngOnInit = existingNgOnInit;
            let output = angular2Binding(target);
            let instance = new output()
            instance.ngOnInit();
            expect(instance.called).to.be.true();
        });

    });

    describe('ngOnDestroy', function() {

        it('must add ngOnDestroy method to the target', function() {
            let target = function() {};
            let output = angular2Binding(target);
            expect(output.prototype.ngOnDestroy).a.function();
        });

        it('must call storeDestroy method when called', function() {
            let target = function() {};
            target.prototype.storeDestroy = spy();
            let output = angular2Binding(target);
            let instance = new output()
            instance.ngOnDestroy();
            expect(instance.storeDestroy.calledOnce).to.be.true();
        });

        it('must call the existing ngOnDestroy method when called', function() {
            let target = function() {};
            let existingNgOnInit = spy();
            target.prototype.storeDestroy = stub();
            target.prototype.ngOnDestroy = existingNgOnInit;
            let output = angular2Binding(target);
            let instance = new output()
            instance.ngOnDestroy();
            expect(existingNgOnInit.calledOnce).to.be.true();
        });

        it('must call the existing ngOnDestroy with the correct context', function() {
            let target = function() { this.called = false; };
            let existingNgOnInit = function() { this.called = true; };
            target.prototype.storeDestroy = stub();
            target.prototype.ngOnDestroy = existingNgOnInit;
            let output = angular2Binding(target);
            let instance = new output()
            instance.ngOnDestroy();
            expect(instance.called).to.be.true();
        });
    });

});
