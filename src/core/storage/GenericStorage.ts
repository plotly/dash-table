import * as R from 'ramda';

import IStorage from './IStorage';
import ShimStorage from './ShimStorage';
import { DashStorageEvents, DashStorageType } from 'dash-table/dash/LocalStorage';

export default class GenericStorage implements IStorage {
    constructor(
        private readonly preferredStore: IStorage,
        private readonly type: DashStorageType,
        private readonly id: string
    ) {

    }

    private readonly prefix = `dash::${this.id}::`;

    private readonly supported = (() => {
        const TEST_KEY = `__storage__test__key__${Date.now()}`;

        try {
            this.preferredStore.setItem(TEST_KEY, TEST_KEY);
            return this.preferredStore.getItem(TEST_KEY) === TEST_KEY;
        } catch {
            return false;
        } finally {
            this.preferredStore.removeItem(TEST_KEY);
        }
    })();

    private readonly store = this.supported ?
        this.preferredStore :
        new ShimStorage();

    private getStore() {
        if (!this.supported) {
            return (this.store as ShimStorage).getStore();
        }

        const store: any = this.store;

        const keys = R.filter(
            key => key.indexOf(this.prefix) === 0,
            R.keysIn(store)
        );

        const res: any = {};
        keys.forEach(key => {
            const value = store[key];
            res[key.slice(this.prefix.length)] = value ? JSON.parse(value) : value;
        });

        return res;
    }

    private dispatch() {
        if (!DashStorageEvents.hasListeners(this.type, this.id)) {
            return;
        }

        DashStorageEvents.dispatch(this.type, this.id, this.getStore());
    }

    private getKey(key: string) {
        return `${this.prefix}${key}`;
    }

    clear() {
        try {
            return this.store.clear();
        } finally {
            this.dispatch();
        }
    }

    getItem(key: string) {
        return this.store.getItem(this.getKey(key));
    }

    removeItem(key: string) {
        try {
            return this.store.removeItem(this.getKey(key));
        } finally {
            this.dispatch();
        }
    }

    setItem(key: string, value: any) {
        try {
            return this.store.setItem(this.getKey(key), JSON.stringify(value));
        } finally {
            this.dispatch();
        }
    }
}