export function angular2Binding(target: any) {
    const existingNgOnInit = target.prototype.ngOnInit;
    const existingNgOnDestroy = target.prototype.ngOnDestroy;
    target.prototype.ngOnInit = function() {
        this.storeInit();
        !existingNgOnInit || existingNgOnInit.call(this);
    }
    target.prototype.ngOnDestroy = function() {
        this.storeDestroy();
        !existingNgOnDestroy || existingNgOnDestroy.call(this);
    }
    return target;
}
