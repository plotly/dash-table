export enum Source {
    Event = 'event'
}

export type Unregister = () => void;

interface IHandler {
    fn: (store: any) => void;
}

export default class EventManager {
    private static readonly map = new Map<string, IHandler[]>();

    static register = (source: Source, id: string, fn: any): Unregister => {
        const event = `${source}::${id}`;
        const handler = { fn };

        ((
            EventManager.map.get(event) ||
            EventManager.map.set(event, []).get(event)
        ) as IHandler[]).push(handler);

        return () => {
            const handlers = EventManager.map.get(event);

            if (handlers) {
                handlers.splice(handlers.indexOf(handler), 1);
            }
        };
    }

    static raise = (source: Source, id: string, storeFn: () => any) => {
        const event = `${source}::${id}`;

        const handlers = EventManager.map.get(event) || [];
        if (!handlers || !handlers.length) {
            return;
        }

        const store = storeFn();
        handlers.forEach(handler => {
            handler.fn(store);
        });
    }
}