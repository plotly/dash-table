import IStorage from './IStorage';
import MemoryStorage from './MemoryStorage';

export default class GenericStorage implements IStorage {
    constructor(private readonly preferredStore: IStorage) {

    }

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
        new MemoryStorage();

    clear = this.store.clear.bind(this.store);
    getItem = this.store.getItem.bind(this.store);
    removeItem = this.store.removeItem.bind(this.store);
    setItem = this.store.setItem.bind(this.store);
}