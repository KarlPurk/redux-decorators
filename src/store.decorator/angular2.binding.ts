export function angular2Binding(target) {
    const existingNgOnInit = target.prototype.ngOnInit;
    const existingNgOnDestroy = target.prototype.ngOnDestroy;
    target.prototype.ngOnInit = function() {
        this.storeInit();
        !existingNgOnInit || existingNgOnInit();
    }
    target.prototype.ngOnDestroy = function() {
        this.storeDestroy();
        !existingNgOnDestroy || existingNgOnDestroy();
    }
}
