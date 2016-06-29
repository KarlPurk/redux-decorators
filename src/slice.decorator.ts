export function Slice(slice: string): Function {
    return function(target: any, method?: string): void {
        const isInstance = !target.prototype;

        if (isInstance) {
            if (!target.stateSliceAffected) {
                target.stateSliceAffected = {};
            }
            target.stateSliceAffected[method] = slice;
            return;
        }
        if (!target.prototype.stateSliceAffected) {
            target.prototype.stateSliceAffected = {};
        }
        target.prototype.stateSliceAffected.all = slice;
    }
}
