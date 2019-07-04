import IStorage from './IStorage';

export default class MemoryStorage implements IStorage {
    private readonly store = new Map<string, string>();

    clear = this.store.clear;
    getItem = this.store.get;
    removeItem = this.store.delete;
    setItem = this.store.set;
}