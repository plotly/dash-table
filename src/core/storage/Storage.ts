import * as R from 'ramda';
import IStorage, { IStorageEntries } from './IStorage';

class BrowserStorage implements IStorage {
    constructor(private readonly store: Storage) {

    }

    clear = this.store.clear.bind(this.store);
    getItem = this.store.getItem.bind(this.store);
    removeItem = this.store.removeItem.bind(this.store);
    setItem = this.store.setItem.bind(this.store);

    getEntries(): IStorageEntries {
        const store: any = this.store;
        const res: IStorageEntries = {};

        R.forEach(key => {
            const value = store[key];
            res[key] = value;
        }, R.keysIn(store));

        return res;
    }
}

export class LocalStorage extends BrowserStorage {
    constructor() {
        super(localStorage);
    }
}

export class SessionStorage extends BrowserStorage {
    constructor() {
        super(sessionStorage);
    }
}

export class MemoryStorage implements IStorage {
    private readonly store = new Map<string, string>();

    clear = this.store.clear.bind(this.store);
    getItem = this.store.get.bind(this.store);
    removeItem = this.store.delete.bind(this.store);
    setItem = this.store.set.bind(this.store);

    getEntries() {
        const res: any = {};

        this.store.forEach((value, key) => {
            res[key] = value;
        });

        return res;
    }
}