import { Component } from 'react';
import EventManager, { Unregister, Source } from '../../core/storage/EventManager';

interface IProps {
    id: string;
}

export default class LocalStorage extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    componentWillMount() {
        const {
            id
        } = this.props;

        this.unregister = EventManager.register(Source.Event, id, (_store: any) => {
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