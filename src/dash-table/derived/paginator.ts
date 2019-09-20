import { memoizeOneFactory } from 'core/memoizer';

import { clearSelection } from 'dash-table/utils/actions';

import {
    Data,
    SetProps,
    TableAction
} from 'dash-table/components/Table/props';

export interface IPaginator {
    loadNext(): void;
    loadPrevious(): void;
    loadFirst(): void;
    loadLast(): void;
    lastPage: number;
}

export function lastPage(data: Data, page_size: number) {
    return Math.max(Math.ceil(data.length / page_size) - 1, 0);
}

function getBackEndPagination(
    page_current: number,
    setProps: SetProps,
    data: Data,
    page_size: number
): IPaginator {
    return {
        loadNext: () => {
            page_current++;
            setProps({ page_current, ...clearSelection });
        },
        loadPrevious: () => {
            if (page_current <= 0) {
                return;
            }

            page_current--;
            setProps({ page_current, ...clearSelection });
        },
        loadFirst: () => {
            page_current = 0;
            setProps({ page_current, ...clearSelection });
        },
        loadLast: () => {
            page_current = lastPage(data, page_size);
            setProps({ page_current, ...clearSelection });
        },
        lastPage: lastPage(data, page_size)
    };
}

function getFrontEndPagination(
    page_current: number,
    page_size: number,
    setProps: SetProps,
    data: Data
) {
    return {
        loadNext: () => {
            const maxPageIndex = lastPage(data, page_size);

            if (page_current >= maxPageIndex) {
                return;
            }

            page_current++;
            setProps({ page_current, ...clearSelection });
        },
        loadPrevious: () => {
            if (page_current <= 0) {
                return;
            }

            page_current--;
            setProps({ page_current, ...clearSelection });
        },
        loadFirst: () => {
            page_current = 0;
            setProps({ page_current, ...clearSelection });
        },
        loadLast: () => {
            page_current = lastPage(data, page_size);
            setProps({ page_current, ...clearSelection });
        },
        lastPage: lastPage(data, page_size)
    };
}

function getNoPagination() {
    return {
        loadNext: () => { },
        loadPrevious: () => { },
        loadFirst: () => { },
        loadLast: () => { },
        lastPage: 0
    };
}

const getter = (
    page_action: TableAction,
    page_current: number,
    page_size: number,
    setProps: SetProps,
    data: Data
): IPaginator => {
    switch (page_action) {
        case TableAction.None:
            return getNoPagination();
        case TableAction.Native:
            return getFrontEndPagination(page_current, page_size, setProps, data);
        case TableAction.Custom:
            return getBackEndPagination(page_current, setProps, data, page_size);
        default:
            throw new Error(`Unknown pagination mode: '${page_action}'`);
    }
};

export default memoizeOneFactory(getter);
