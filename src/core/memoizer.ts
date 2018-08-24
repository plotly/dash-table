import { isEqualArgs } from 'core/comparer';

type ResultFn = (...args: any[]) => any;

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