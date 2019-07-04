import { Component } from 'react';
import DashStorageEvents, { DashStorageType, Unregister } from './DashStorageEvents';

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

        this.unregister = DashStorageEvents.register(type, id, (_store: any) => {

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