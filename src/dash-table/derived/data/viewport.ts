import { memoizeOneFactory } from 'core/memoizer';
import { IPaginator } from 'dash-table/derived/paginator';

import {
    Data,
    Indices,
    IDerivedData,
    TableAction
} from 'dash-table/components/Table/props';

function getFrontEndPagination(paginator: IPaginator, data: Data, indices: Indices): IDerivedData {
    let currentPage = paginator.hasCount ?
        Math.min(paginator.current, paginator.size - 1) :
        paginator.current;

    const firstIndex = paginator.size * currentPage;
    const lastIndex = Math.min(
        firstIndex + paginator.size,
        data.length
    );

    return {
        data: data.slice(firstIndex, lastIndex),
        indices: indices.slice(firstIndex, lastIndex)
    };
}

function getNullPagination(data: Data, indices: Indices): IDerivedData {
    return { data, indices };
}

const getter = (
    page_action: TableAction,
    paginator: IPaginator,
    data: Data,
    indices: Indices
): IDerivedData => {
    switch (page_action) {
        case TableAction.Native:
            return getFrontEndPagination(paginator, data, indices);
        case TableAction.None:
        case TableAction.Custom:
            return getNullPagination(data, indices);
        default:
            throw new Error(`Unknown pagination mode: '${page_action}'`);
    }
};

export default memoizeOneFactory(getter);
