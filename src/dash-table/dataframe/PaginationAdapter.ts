import { Dataframe, Indices, IPaginationSettings, PropsWithDefaults, PaginationMode, SetProps } from 'dash-table/components/Table/props';
import { memoizeOne } from 'core/memoizer';

import BackEndPaginationStrategy from 'dash-table/pagination/BackEndPaginiation';
import FrontEndPaginationStrategy from 'dash-table/pagination/FrontEndPagination';
import NoPaginationStrategy from 'dash-table/pagination/NoPagination';
import AbstractPaginationStrategy from 'dash-table/pagination/AbstractStrategy';

export default class PaginationAdapter {
    constructor(
        private readonly propsFn: () => PropsWithDefaults,
        private readonly dataFn: () => { virtual_dataframe: Dataframe, virtual_indices: Indices },
        private readonly setProps: SetProps

    ) { }

    get() {
        const {
            pagination_mode,
            pagination_settings
        } = this.propsFn();

        return this.getPaginator(
            pagination_mode,
            pagination_settings
        );
    }

    private getPaginator = memoizeOne((
        pagination_mode: PaginationMode,
        _pagination_settings: IPaginationSettings
    ): AbstractPaginationStrategy => {
        switch (pagination_mode) {
            case false:
                return new NoPaginationStrategy(this.propsFn, this.setProps);
            case true:
            case 'fe':
                return new FrontEndPaginationStrategy(this.propsFn, this.dataFn, this.setProps);
            case 'be':
                return new BackEndPaginationStrategy(this.propsFn, this.setProps);
            default:
                throw new Error(`Unknown pagination mode: '${pagination_mode}'`);
        }
    });
}