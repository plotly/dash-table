import AbstractStrategy from 'dash-table/pagination/AbstractStrategy';
import { Dataframe, PropsWithDefaults, SetProps } from 'dash-table/components/Table/props';

export default class FrontEndPaginationStrategy extends AbstractStrategy {
    constructor(propsFn: () => PropsWithDefaults, private dataFn: () => { virtual_dataframe: Dataframe }, setProps: SetProps) {
        super(propsFn, setProps);
    }

    public loadNext() {
        let { setProps, settings } = this;
        let { virtual_dataframe } = this.dataFn();

        let maxPageIndex = Math.floor(virtual_dataframe.length / settings.page_size);

        if (settings.current_page >= maxPageIndex) {
            return;
        }

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