export interface IStorageEntries {
    [key: string]: any;
}

export default interface IStorage {
    clear(): void;
    getItem(key: string): string | null | undefined;
    removeItem(key: string): void;
    setItem(key: string, value: string | null): void;

    getEntries(): IStorageEntries;
}

export type IStorageConstructor = new() => IStorage;