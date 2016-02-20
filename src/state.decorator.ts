
export function State(): Function {
    return function(target: any, ...props: string[]): void {
        if (target.stateProperties === undefined) {
            target.stateProperties = [];
        }
        if (props.length) {
            target.stateProperties = target.stateProperties.concat(props);
        }
    }
}
