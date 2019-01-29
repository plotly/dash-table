import * as R from 'ramda';
import { memoizeOne } from 'core/memoizer';

type CacheKeyFragment = string | number | boolean;
type CacheKey = CacheKeyFragment[];

export default function memoizerCache<
    TKey extends CacheKeyFragment[],
    TArgs extends any[],
    TEntry
>(fn: (...args: TArgs) => TEntry) {
    const cache = new Map<CacheKeyFragment, any>();

    return (key: TKey, ...args: TArgs): TEntry => {
        const lastKey = key.slice(-1)[0];
        const cacheKeys = key.slice(0, -1);

        const fnCacne = R.reduce((c, fragment) => {
            return c.get(fragment) || c.set(fragment, new Map()).get(fragment);
        }, cache, cacheKeys);

        return (
            fnCacne.get(lastKey) ||
            fnCacne.set(lastKey, memoizeOne(fn)).get(lastKey)
        )(...args);
    };
}

export const memoizerCache2 = <TKey extends CacheKey>() => {
    return <TEntryFn extends (...a: any[]) => any>(fn: TEntryFn) => {
        const cache = new Map<CacheKeyFragment, any>();

        function getCache(...key: TKey) {
            const cacheKeys = key.slice(0, -1);

            return R.reduce((c, fragment) => {
                return c.get(fragment) || c.set(fragment, new Map()).get(fragment);
            }, cache, cacheKeys) as Map<CacheKeyFragment, any>;
        }

        function get(...key: TKey) {
            const lastKey = key.slice(-1)[0];

            const nestedCache = getCache(...key);

            return (
                nestedCache.get(lastKey) ||
                nestedCache.set(lastKey, memoizeOne(fn)).get(lastKey)
            ) as TEntryFn;
        }

        return { get };
    };
};