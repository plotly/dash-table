import { CacheKeyFragment, getCache } from '.';

export default <TKey extends CacheKeyFragment[]>() =>
    <TEntry>(fn: (...a: TKey) => TEntry) => {
        const cache = new Map<CacheKeyFragment, any>();

        function get(...key: TKey) {
            const lastKey = key.slice(-1)[0];

            const nestedCache = getCache(cache, ...key);

            return (
                nestedCache.get(lastKey) ||
                nestedCache.set(lastKey, fn(...key)).get(lastKey)
            ) as TEntry;
        }

        return { get };
    };