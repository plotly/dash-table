type ResultFn = (...args: any[]) => any;

function isPlainObject(candidate: any) {
    return typeof candidate === 'object' && candidate.constructor === Object;
}

export function isEqual(obj1: object, obj2: object, deep: boolean = false) {
    return obj1 === obj2 || isEqualArgs(
        Object.values(obj1),
        Object.values(obj2),
        deep
    );
}

export function isEqualArgs(args1: any[] | null, args2: any[], deep: boolean = false): boolean {
    return (
        !!args1 &&
        args1.length === args2.length &&
        !!args1.every((arg1, index) => {
            const arg2 = args2[index];

            return arg1 === arg2 || (deep && (
                (Array.isArray(arg1) && Array.isArray(arg2) && isEqualArgs(arg1, arg2, deep)) ||
                (isPlainObject(arg1) && isPlainObject(arg2) && isEqual(arg1, arg2, deep))
            ));
        })
    );
}

export const memoizeOne: ((...args: any[]) => ResultFn) = (resultFn: ResultFn) => {
    let lastArgs: any[] | null = null;
    let lastResult: any;

    return (...args: any[]) => {
        return isEqualArgs(lastArgs, args) ?
            lastResult :
            (lastArgs = args) && (lastResult = resultFn(...args));
    };
};

export const memoizeAll: ((...args: any[]) => ResultFn) = (resultFn: ResultFn) => {
    const cache: { args: any[], result: any }[] = [];

    return (...args: any[]) => {
        let entry = cache.find(e => isEqualArgs(e.args, args));

        return entry ?
            entry.result :
            cache.push({ args, result: resultFn(...args) }) && cache.slice(-1)[0].result;
    };
};