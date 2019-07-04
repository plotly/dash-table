import { Component } from 'react';

export enum DashStorageType {
    Local = 'local',
    Session = 'session'
}

type Unregister = () => void;
interface IHandler {
    fn: (store: any) => void;
}

export class DashStorageEvents {
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

interface IProps {
    id: string;
    type?: DashStorageType;
}

interface IDefaults {
    type: DashStorageType;
}

type PropsWithDefaults = IProps & IDefaults;

export default class LocalStorage extends Component<IProps> {
    public static defaultProps = {
        type: DashStorageType.Local
    };

    constructor(props: PropsWithDefaults) {
        super(props);
    }

    componentWillMount() {
        const {
            id,
            type
        } = this.props as PropsWithDefaults;

        this.unregister = DashStorageEvents.register(type, id, (store: any) => {
            console.log('Storage event', store);
        });
    }

    componentWillUnmount() {
        if (this.unregister) {
            this.unregister();
            this.unregister = undefined;
        }
    }

    render = () => null;

    private unregister: Unregister | undefined;
}