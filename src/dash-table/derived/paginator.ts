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
    lastPage: number | undefined;
    goToPage(page_number: string): void;
}

export function lastPage(data: Data, page_size: number) {
    return Math.max(Math.ceil(data.length / page_size) - 1, 0);
}

function getBackEndPagination(
    page_current: number,
    setProps: SetProps,
    max_page_count: number | undefined
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
            if (max_page_count) {
                page_current = max_page_count;
                setProps({ page_current, ...clearSelection });
            }
        },
        lastPage: max_page_count,
        goToPage: (page_number: string) => {

            let page = parseInt(page_number, 10);

            if (isNaN(page)) {
                return;
            }

            page--;

            if (page < 0) {
                page_current = 0;
                setProps({ page_current, ...clearSelection });
                return;
            }

            if (max_page_count && page > max_page_count) {
                page_current = max_page_count;
                setProps({ page_current, ...clearSelection });
                return;
            }

            page_current = page;
            setProps({ page_current, ...clearSelection });
        }
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
        lastPage: lastPage(data, page_size),
        goToPage: (page_number: string) => {

            let page = parseInt(page_number, 10);

            if (isNaN(page)) {
                return;
            }

            page--;

            if (page < 0) {
                page_current = 0;
                setProps({ page_current, ...clearSelection });
                return;
            }

            if (page > lastPage(data, page_size)) {
                page_current = lastPage(data, page_size);
                setProps({ page_current, ...clearSelection });
                return;
            }

            page_current = page;
            setProps({ page_current, ...clearSelection });
        }
    };
}

function getNoPagination() {
    return {
        loadNext: () => { },
        loadPrevious: () => { },
        loadFirst: () => { },
        loadLast: () => { },
        lastPage: 0,
        goToPage: () => { }
    };
}

const getter = (
    page_action: TableAction,
    page_current: number,
    page_size: number,
    max_page_count: number | undefined,
    setProps: SetProps,
    data: Data
): IPaginator => {
    switch (page_action) {
        case TableAction.None:
            return getNoPagination();
        case TableAction.Native:
            return getFrontEndPagination(page_current, page_size, setProps, data);
        case TableAction.Custom:
            return getBackEndPagination(page_current, setProps, max_page_count);
        default:
            throw new Error(`Unknown pagination mode: '${page_action}'`);
    }
};

export default memoizeOneFactory(getter);
