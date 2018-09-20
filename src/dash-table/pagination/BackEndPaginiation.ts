import { PropsWithDefaults, SetProps } from 'dash-table/components/Table/props';
import AbstractPaginationStrategy from 'dash-table/pagination/AbstractStrategy';

export default class BackEndPaginationStrategy extends AbstractPaginationStrategy {
    constructor(propsFn: () => PropsWithDefaults, setProps: SetProps) {
        super(propsFn, setProps);
    }

    public loadNext() {
        let { setProps, settings } = this;

        settings.current_page++;
        setProps({ pagination_settings: settings });
    }

    public loadPrevious() {
        let { setProps, settings } = this;

        if (settings.current_page <= 0) {
            return;
        }

        settings.current_page--;
        setProps({ pagination_settings: settings });
    }
}