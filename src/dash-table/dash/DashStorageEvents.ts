export enum DashStorageType {
    Local = 'local',
    Session = 'session'
}

export type Unregister = () => void;

interface IHandler {
    fn: (store: any) => void;
}

export default class DashStorageEvents {
    private static readonly map = new Map<string, IHandler[]>();

    static register(type: DashStorageType, id: string, fn: any): Unregister {
        const event = `${type}::${id}`;
        const handler = { fn };

        ((
            this.map.get(event) ||
            this.map.set(event, []).get(event)
        ) as IHandler[]).push(handler);

        return () => {
            const handlers = this.map.get(event);

            if (handlers) {
                handlers.splice(handlers.indexOf(handler), 1);
            }
        };
    }

    static hasListeners(type: DashStorageType, id: string) {
        const event = `${type}::${id}`;
        const handlers = this.map.get(event);

        return handlers && handlers.length;
    }

    static dispatch(type: DashStorageType, id: string, store: any) {
        const event = `${type}::${id}`;

        const handlers = this.map.get(event) || [];
        handlers.forEach(handler => {
            handler.fn(store);
        });
    }
}