import { Dataframe, Indices, IPaginationSettings, PropsWithDefaults, PaginationMode } from 'dash-table/components/Table/props';
import { memoizeOneWithFlag } from 'core/memoizer';

interface IResult {
    viewport_dataframe: Dataframe;
    viewport_indices: Indices;
}

export default class ViewportDataframeAdapter {
    constructor(
        private propsFn: () => PropsWithDefaults,
        private dataFn: () => { virtual_dataframe: Dataframe, virtual_indices: Indices },

    ) { }

    get() {
        const {
            pagination_mode,
            pagination_settings
        } = this.propsFn();

        const {
            virtual_dataframe,
            virtual_indices
        } = this.dataFn();

        return this.getDataframe(
            pagination_mode,
            pagination_settings,
            virtual_dataframe,
            virtual_indices
        );
    }

    private getDataframe = memoizeOneWithFlag((
        pagination_mode: PaginationMode,
        pagination_settings: IPaginationSettings,
        dataframe: Dataframe,
        indices: Indices
    ): IResult => {
        switch (pagination_mode) {
            case false:
                return this.getNoPagination(dataframe, indices);
            case true:
            case 'fe':
                return this.getFrontEndPagination(pagination_settings, dataframe, indices);
            case 'be':
                return this.getBackEndPagination(dataframe, indices);
            default:
                throw new Error(`Unknown pagination mode: '${pagination_mode}'`);
        }
    });

    private getNoPagination(dataframe: Dataframe, indices: Indices): IResult {
        return { viewport_dataframe: dataframe, viewport_indices: indices };
    }

    private getFrontEndPagination(settings: IPaginationSettings, dataframe: Dataframe, indices: Indices): IResult {
        let currentPage = Math.min(
            settings.current_page,
            Math.floor(dataframe.length / settings.page_size)
        );

        const firstIndex = settings.page_size * currentPage;
        const lastIndex = Math.min(
            firstIndex + settings.displayed_pages * settings.page_size,
            dataframe.length
        );

        return {
            viewport_dataframe: dataframe.slice(firstIndex, lastIndex),
            viewport_indices: indices.slice(firstIndex, lastIndex)
        };
    }

    private getBackEndPagination(dataframe: Dataframe, indices: Indices): IResult {
        return { viewport_dataframe: dataframe, viewport_indices: indices };
    }
}