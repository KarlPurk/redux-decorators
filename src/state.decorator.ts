
export function State() {
    return function(target) {
        console.log('@State: ', target);
        if (target.stateProperties === undefined) {
                target.stateProperties = [];
        }
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        target.stateProperties = target.stateProperties.concat(args);
    }
}
