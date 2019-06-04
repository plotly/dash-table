import * as R from 'ramda';

import { ColumnId } from 'dash-table/components/Table/props';

export interface ISortBy {
    column_id: ColumnId;
    direction: SortDirection;
}

export enum SortDirection {
    Ascending = 'asc',
    Descending = 'desc',
    None = 'none'
}

export type SortBy = ISortBy[];
type IsNullyFn = (value: any, id: string) => boolean;
export const defaultIsNully: IsNullyFn = (value: any, _: string) => R.isNil(value);
export default (data: any[], sortBy: SortBy, isNully: IsNullyFn = defaultIsNully): any[] => {
    if (!sortBy.length) {
        return data;
    }

    return R.sortWith(
        R.map(setting => {
            return setting.direction === SortDirection.Descending ?
                R.comparator((d1: any, d2: any) => {
                    const id = setting.column_id;

                    const prop1 = d1[id];
                    const prop2 = d2[id];

                    if (isNully(prop1, setting.column_id)) {
                        return false;
                    } else if (isNully(prop2, setting.column_id)) {
                        return true;
                    }

                    return prop1 > prop2;
                }) :
                R.comparator((d1: any, d2: any) => {
                    const id = setting.column_id;

                    const prop1 = d1[id];
                    const prop2 = d2[id];

                    if (isNully(prop1, setting.column_id)) {
                        return false;
                    } else if (isNully(prop2, setting.column_id)) {
                        return true;
                    }

                    return prop1 < prop2;
                });
        }, sortBy),
        data
    );
};