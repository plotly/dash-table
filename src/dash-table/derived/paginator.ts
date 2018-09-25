import { memoizeOneFactory } from 'core/memoizer';

import {
    Dataframe,
    PaginationMode,
    SetProps,
    IPaginationSettings
} from 'dash-table/components/Table/props';

export interface IPaginator {
    loadNext(): void;
    loadPrevious(): void;
}

function getBackEndPagination(
    pagination_settings: IPaginationSettings,
    setProps: SetProps
): IPaginator {
    return {
        loadNext: () => {
            pagination_settings.current_page++;
            setProps({ pagination_settings });
        },
        loadPrevious: () => {
            if (pagination_settings.current_page <= 0) {
                return;
            }

            pagination_settings.current_page--;
            setProps({ pagination_settings });
        }
    };
}

function getFrontEndPagination(
    pagination_settings: IPaginationSettings,
    setProps: SetProps,
    virtual_dataframe: Dataframe
) {
    return {
        loadNext: () => {
            let maxPageIndex = Math.floor(virtual_dataframe.length / pagination_settings.page_size);

            if (pagination_settings.current_page >= maxPageIndex) {
                return;
            }

            pagination_settings.current_page++;
            setProps({ pagination_settings });
        },
        loadPrevious: () => {
            if (pagination_settings.current_page <= 0) {
                return;
            }

            pagination_settings.current_page--;
            setProps({ pagination_settings });
        }
    };
}

function getNoPagination() {
    return {
        loadNext: () => { },
        loadPrevious: () => { }
    };
}

const getter = (
    pagination_mode: PaginationMode,
    pagination_settings: IPaginationSettings,
    setProps: SetProps,
    virtual_dataframe: Dataframe
): IPaginator => {
    switch (pagination_mode) {
        case false:
            return getNoPagination();
        case true:
        case 'fe':
            return getFrontEndPagination(pagination_settings, setProps, virtual_dataframe);
        case 'be':
            return getBackEndPagination(pagination_settings, setProps);
        default:
            throw new Error(`Unknown pagination mode: '${pagination_mode}'`);
    }
};

export default memoizeOneFactory(getter);