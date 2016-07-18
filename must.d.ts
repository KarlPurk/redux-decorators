declare module '~must/lib/must' {

    interface Must {
        expect(): Must;
        true(): Must;
        property(...expected: Array<any>): Must;
        undefined(): Must;
        eql(expected: any): Must;
        equal(expected: any): Must;
        contain(expected: any): Must;
        include(expected: any): Must;
        function(): Must;
        a: Must;
        to: Must;
        be: Must;
    }

    interface MustFactory {
        (target: any): Must;
    }

    var must: MustFactory;

    export = must;
}

declare module 'must' {
    import main = require('~must/lib/must');
    export = main;
}
