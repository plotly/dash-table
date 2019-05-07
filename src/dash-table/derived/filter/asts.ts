import * as R from 'ramda';

import { memoizeOneFactory } from 'core/memoizer';

import { VisibleColumns, IVisibleColumn } from 'dash-table/components/Table/props';
import { SingleColumnSyntaxTree, MultiColumnsSyntaxTree, getSingleColumnMap } from 'dash-table/syntax-tree';

export default memoizeOneFactory((
    map: Map<string, SingleColumnSyntaxTree>,
    query: string,
    columns: VisibleColumns
): Map<string, SingleColumnSyntaxTree> => {
    const multiQuery = new MultiColumnsSyntaxTree(query);
    const reversed = getSingleColumnMap(multiQuery, columns);

    /*
     * Couldn't process the query, just use the previous value.
     */
    if (!reversed) {
        return map;
    }

    /* Mapping multi-column to single column queries will expand
     * compressed forms. If the new ast query is equal to the
     * old one, keep the old one instead.
     *
     * If the value was changed by the user, the current ast will
     * have been modified already and the UI experience will also
     * be consistent in that case.
     */
    let newMap = map;

    R.forEach(([key, ast]) => {
        const newAst = reversed.get(key);

        if (newAst && newAst.toQueryString() === ast.toQueryString()) {
            /*
             * Only return a new map instance if something changes
             */
            newMap = (newMap === map) ?
                new Map<string, SingleColumnSyntaxTree>(map) :
                newMap;

            newMap.set(key, ast);
        }
    }, Array.from(map.entries()));

    return newMap;
});

export const updateMap = (
    map: Map<string, SingleColumnSyntaxTree>,
    column: IVisibleColumn,
    value: any
): Map<string, SingleColumnSyntaxTree> => {
    const safeColumnId = column.id.toString();

    map = new Map<string, SingleColumnSyntaxTree>(map);

    if (value && value.length) {
        map.set(safeColumnId, new SingleColumnSyntaxTree(value, column));
    } else {
        map.delete(safeColumnId);
    }

    return map;
};