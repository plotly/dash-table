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
    goToPage(page: number): void;
    disablePrevious(): boolean;
    disableNext(): boolean;
    disableLast(): boolean;
}

export function lastPage(data: Data, page_size: number) {
    return Math.max(Math.ceil(data.length / page_size) - 1, 0);
}

function getBackEndPagination(
    page_current: number,
    setProps: SetProps,
    page_count: number | undefined
): IPaginator {

    // adjust for zero-indexing
    if (page_count) {
        page_count = Math.max(0, page_count - 1);
    }

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
            if (page_count) {
                page_current = page_count;
                setProps({ page_current, ...clearSelection });
            }
        },
        lastPage: page_count,
        goToPage: (page: number) => {

            // adjust for zero-indexing
            page--;

            page_current = page;

            if (page < 0) {
                page_current = 0;
            }

            if (page_count && page > page_count) {
                page_current = page_count;
            }

            setProps({ page_current, ...clearSelection });
        },
        disablePrevious: () => {
            return page_current === 0;
        },
        disableNext: () => {
            return page_count !== undefined && page_current === page_count;
        },
        disableLast: () => {
            return page_count === undefined ? true : page_current === page_count;
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
        goToPage: (page: number) => {

            page--;

            page_current = page;

            if (page < 0) {
                page_current = 0;
            }

            if (page > lastPage(data, page_size)) {
                page_current = lastPage(data, page_size);
            }

            setProps({ page_current, ...clearSelection });
        },
        disablePrevious: () => {
            return (page_current === 0);
        },
        disableNext: () => {
            return (page_current === lastPage(data, page_size));
        },
        disableLast: () => {
            return (page_current === lastPage(data, page_size));
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
        goToPage: () => { },
        disablePrevious: () => true,
        disableNext: () => true,
        disableLast: () => true
    };
}

const getter = (
    page_action: TableAction,
    page_current: number,
    page_size: number,
    page_count: number | undefined,
    setProps: SetProps,
    data: Data
): IPaginator => {
    switch (page_action) {
        case TableAction.None:
            return getNoPagination();
        case TableAction.Native:
            return getFrontEndPagination(page_current, page_size, setProps, data);
        case TableAction.Custom:
            return getBackEndPagination(page_current, setProps, page_count);
        default:
            throw new Error(`Unknown pagination mode: '${page_action}'`);
    }
};

export default memoizeOneFactory(getter);
