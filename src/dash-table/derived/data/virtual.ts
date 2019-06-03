import * as R from 'ramda';

import { memoizeOneFactory } from 'core/memoizer';
import sort, { SortSettings } from 'core/sorting';
import {
    ColumnId,
    Data,
    Datum,
    IDerivedData,
    SortAsNone,
    VisibleColumns,
    TableAction
} from 'dash-table/components/Table/props';
import { QuerySyntaxTree } from 'dash-table/syntax-tree';

const getter = (
    columns: VisibleColumns,
    data: Data,
    filtering: TableAction,
    filter: string,
    sorting: TableAction,
    sort_by: SortSettings = []
): IDerivedData => {
    const map = new Map<Datum, number>();
    R.addIndex(R.forEach)((datum, index) => {
        map.set(datum, index);
    }, data);

    if (filtering === TableAction.Default) {
        const tree = new QuerySyntaxTree(filter);

        data = tree.isValid ?
            tree.filter(data) :
            data;
    }

    const getNullyCases = (
        columnId: ColumnId
    ): SortAsNone => {
        const column = R.find(c => c.id === columnId, columns);

        return (column && column.sort_as_none) || [];
    };

    const isNully = (
        value: any,
        columnId: ColumnId
    ) => R.isNil(value) || R.contains(value, getNullyCases(columnId));

    if (sorting === TableAction.Default) {
        data = sort(data, sort_by, isNully);
    }

    // virtual_indices
    const indices = R.map(datum => map.get(datum) as number, data);

    return { data, indices };
};

export default memoizeOneFactory(getter);
