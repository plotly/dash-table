import * as R from 'ramda';
import { memoizeOne } from 'core/memoizer';

type CacheKeyFragment = string | number | boolean;

export default class MemoizerCache<
    TKey extends CacheKeyFragment[],
    TArgs extends any[],
    TEntry>
{
    private cache = new Map<CacheKeyFragment, any>();

    constructor(private readonly fn: (...args: TArgs) => TEntry) {

    }

    get(key: TKey, args: TArgs): TEntry {
        return this.getFn(key)(...args);
    }

    private memoize() {
        return memoizeOne((...args: TArgs) => this.fn(...args));
    }

    private getFn(key: TKey): (...args: TArgs) => TEntry {
        const lastKey = key.slice(-1)[0];
        const cacheKeys = key.slice(0, -1);

        let fnCacne = R.reduce((c, fragment) => {
            return c.get(fragment) || c.set(fragment, new Map()).get(fragment);
        }, this.cache, cacheKeys);

        return fnCacne.get(lastKey) ||
            fnCacne.set(lastKey, this.memoize()).get(lastKey);
    }
}