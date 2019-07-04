import IStorage from './IStorage';

export default class ShimStorage implements IStorage {
    private readonly store = new Map<string, string>();

    clear = this.store.clear.bind(this.store);
    getItem = this.store.get.bind(this.store);
    removeItem = this.store.delete.bind(this.store);
    setItem = this.store.set.bind(this.store);

    getStore() {
        const res: any = {};

        this.store.forEach((value, key) => {
            res[key] = value;
        });

        return res;
    }
}