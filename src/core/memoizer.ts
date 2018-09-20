import { isEqualArgs } from 'core/comparer';
import { ResultFn } from 'core/generic';

interface ICachedResultFn<TEntry> {
    result: TEntry;
    cached: boolean;
}

export function memoizeOne<
    TArgs extends any[],
    TEntry
    >(fn: ResultFn<TArgs, TEntry>): ResultFn<TArgs, TEntry> {
    let lastArgs: any[] | null = null;
    let lastResult: any;

    return (...args: TArgs): TEntry => {
        return isEqualArgs(lastArgs, args) ?
            lastResult :
            (lastArgs = args) && (lastResult = fn(...args));
    };
}

export function memoizeOneWithFlag<
    TArgs extends any[],
    TEntry
    >(fn: ResultFn<TArgs, TEntry>): ResultFn<TArgs, ICachedResultFn<TEntry>> {
    let lastArgs: any[] | null = null;
    let lastResult: any;

    return (...args: TArgs): ICachedResultFn<TEntry> => {
        return isEqualArgs(lastArgs, args) ?
            { cached: true, result: lastResult } :
            { cached: false, result: (lastArgs = args) && (lastResult = fn(...args)) };
    };
}

export function memoizeAll<
    TArgs extends any[],
    TEntry
    >(fn: ResultFn<TArgs, TEntry>): ResultFn<TArgs, TEntry> {
    const cache: { args: TArgs, result: TEntry }[] = [];

    return (...args: TArgs): TEntry => {
        let entry = cache.find(e => isEqualArgs(e.args, args));

        return (
            entry ||
            cache[cache.push({ args, result: fn(...args) }) - 1]
        ).result;
    };
}