import { Dataframe, Indices, PaginationMode, PropsWithDefaults, SetProps } from 'dash-table/components/Table/props';
import { memoizeOne } from 'core/memoizer';

interface IPaginator {
    loadNext(): void;
    loadPrevious(): void;
}

export default class PaginationAdapter {
    constructor(
        private readonly propsFn: () => PropsWithDefaults,
        private readonly dataFn: () => { virtual_dataframe: Dataframe, virtual_indices: Indices },
        private readonly setProps: SetProps
    ) { }

    get() {
        const { pagination_mode } = this.propsFn();

        return this.getPaginator(pagination_mode);
    }

    private getPaginator = memoizeOne(
        (pagination_mode: PaginationMode): IPaginator => {
            switch (pagination_mode) {
                case false:
                    return this.getNoPagination();
                case true:
                case 'fe':
                    return this.getFrontEndPagination();
                case 'be':
                    return this.getBackEndPagination();
                default:
                    throw new Error(`Unknown pagination mode: '${pagination_mode}'`);
            }
        }
    );

    private getBackEndPagination(): IPaginator {
        return {
            loadNext: () => {
                let { pagination_settings: settings } = this.propsFn();

                settings.current_page++;
                this.setProps({ pagination_settings: settings });
            },
            loadPrevious: () => {
                let { pagination_settings: settings } = this.propsFn();

                if (settings.current_page <= 0) {
                    return;
                }

                settings.current_page--;
                this.setProps({ pagination_settings: settings });
            }
        };
    }

    private getFrontEndPagination() {
        return {
            loadNext: () => {
                let { pagination_settings: settings } = this.propsFn();
                let { virtual_dataframe } = this.dataFn();

                let maxPageIndex = Math.floor(virtual_dataframe.length / settings.page_size);

                if (settings.current_page >= maxPageIndex) {
                    return;
                }

                settings.current_page++;
                this.setProps({ pagination_settings: settings });
            },
            loadPrevious: () => {
                let { pagination_settings: settings } = this.propsFn();

                if (settings.current_page <= 0) {
                    return;
                }

                settings.current_page--;
                this.setProps({ pagination_settings: settings });
            }
        };
    }

    private getNoPagination() {
        return {
            loadNext: () => { },
            loadPrevious: () => { }
        };
    }
}