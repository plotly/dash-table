export default interface IStorage {
    clear(): void;
    getItem(key: string): string | null | undefined;
    removeItem(key: string): void;
    setItem(key: string, value: string | null): void;
}