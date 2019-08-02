import * as R from 'ramda';

import IStorage, { IStorageEntries, IStorageConstructor } from './IStorage';
import EventManager, { Source } from 'core/storage/EventManager';
import { MemoryStorage, LocalStorage } from './Storage';

export default class GenericStorage implements IStorage {
    constructor(
        private readonly id: string,
        private readonly PreferredStore: IStorageConstructor = LocalStorage
    ) { }

    clear = () => {
        try {
            R.forEach(
                key => this.store.removeItem(key),
                this.getKeys()
            );
        } finally {
            this.raise();
        }
    }

    getEntries = () => {
        const entries = this.store.getEntries();
        const res: IStorageEntries = {};

        R.forEach(key => {
            const value = entries[key];
            res[key.slice(this.prefix.length)] = this.parseIf(value);
        }, this.getKeys());

        return res;
    }

    getItem = (key: string, defaultValue?: any) => {
        const rawValue = this.store.getItem(this.getKey(key));

        return this.parseIf(rawValue, defaultValue);
    }

    removeItem = (key: string) => {
        try {
            return this.store.removeItem(this.getKey(key));
        } finally {
            this.raise();
        }
    }

    setItem = (key: string, value: any) => {
        try {
            return R.isNil(value) ?
                this.removeItem(key) :
                this.store.setItem(this.getKey(key), JSON.stringify(value));
        } finally {
            this.raise();
        }
    }

    private readonly prefix = `dash::${this.id}::`;

    private readonly store = (() => {
        const TEST_KEY = `__storage__test__key__${Date.now()}`;

        if (!this.PreferredStore) {
            return new MemoryStorage();
        }

        let store = new this.PreferredStore();
        try {
            store.setItem(TEST_KEY, TEST_KEY);
            if (store.getItem(TEST_KEY) === TEST_KEY) {
                store.removeItem(TEST_KEY);
            } else {
                store = new MemoryStorage();
            }
        } catch {
            store = new MemoryStorage();
        }

        return store;
    })();

    private getKey(key: string) {
        return `${this.prefix}${key}`;
    }

    private getKeys = () => R.filter(
        key => key.indexOf(this.prefix) === 0,
        R.keysIn(this.store)
    )

    private parseIf = (value: any, defaultValue: any = value) => {
        if (R.isNil(value)) {
            return defaultValue;
        }

        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }

    private raise = EventManager.raise.bind(undefined, Source.Event, this.id, this.getEntries);
}