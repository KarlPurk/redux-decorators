
export function State(target) {
    console.log('State');
    if (target.stateProperties === undefined) {
        target.stateProperties = [];
    }
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    target.stateProperties = target.stateProperties.concat(args);
    console.log(target.stateProperties);
}

export function Store(/*target*/) {
    console.log('Store');
    var args = Array.prototype.slice.call(arguments);
    console.log(this, args);
    let target = args[args.length - 1];
    let stateProperties = args.length > 1 ? args.slice(0, args.length - 1) : [];
    var existingNgOnInit = target.prototype.ngOnInit;
    var existingNgOnDestroy = target.prototype.ngOnDestroy;
    if (target.prototype.stateProperties === undefined) {
        target.prototype.stateProperties = [];
    }
    console.log(target.prototype.stateProperties);
    target.prototype.stateProperties = target.prototype.stateProperties.concat(stateProperties);
    target.prototype.ngOnInit = function() {
        let storeUpdateHandler = () => {
            let state = this.appStore.getState( );
            this.stateProperties.forEach((prop) => {
                this[prop] = state[prop];
            });
        };
        this.unsubscribe = this.appStore.subscribe(storeUpdateHandler);
        !existingNgOnInit || existingNgOnInit();
        // Apply the default state to all listeners
        storeUpdateHandler();
    }
    target.prototype.ngOnDestroy = function() {
        this.unsubscribe();
        !existingNgOnDestroy || existingNgOnDestroy();
    }
}
