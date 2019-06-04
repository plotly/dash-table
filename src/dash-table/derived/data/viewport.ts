import { memoizeOneFactory } from 'core/memoizer';
import { lastPage } from 'dash-table/derived/paginator';

import {
    Data,
    Indices,
    IPaginationSettings,
    IDerivedData,
    TableAction
} from 'dash-table/components/Table/props';

function getNoPagination(data: Data, indices: Indices): IDerivedData {
    return { data, indices };
}

function getFrontEndPagination(settings: IPaginationSettings, data: Data, indices: Indices): IDerivedData {
    let currentPage = Math.min(settings.current_page, lastPage(data, settings));

    const firstIndex = settings.page_size * currentPage;
    const lastIndex = Math.min(
        firstIndex + settings.page_size,
        data.length
    );

    return {
        data: data.slice(firstIndex, lastIndex),
        indices: indices.slice(firstIndex, lastIndex)
    };
}

function getBackEndPagination(data: Data, indices: Indices): IDerivedData {
    return { data, indices };
}

const getter = (
    page_action: TableAction,
    pagination_settings: IPaginationSettings,
    data: Data,
    indices: Indices
): IDerivedData => {
    switch (page_action) {
        case TableAction.None:
            return getNoPagination(data, indices);
        case TableAction.Native:
            return getFrontEndPagination(pagination_settings, data, indices);
        case TableAction.Custom:
            return getBackEndPagination(data, indices);
        default:
            throw new Error(`Unknown pagination mode: '${page_action}'`);
    }
};

export default memoizeOneFactory(getter);
