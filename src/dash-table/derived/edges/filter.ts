import * as R from 'ramda';

import Environment from 'core/environment';
import { memoizeOneFactory } from 'core/memoizer';

import {
    IVisibleColumn,
    VisibleColumns
} from 'dash-table/components/Table/props';

import { IConvertedStyle } from '../style';
import { EdgesMatrices } from './type';
import { SingleColumnSyntaxTree } from 'dash-table/syntax-tree';
import { getFilterCellEdges } from '.';

export default memoizeOneFactory((
    columns: VisibleColumns,
    showFilters: boolean,
    map: Map<string, SingleColumnSyntaxTree>,
    styles: IConvertedStyle[],
    listViewStyle: boolean
) => {
    if (!showFilters || columns.length === 0) {
        return;
    }

    const edges = new EdgesMatrices(1, columns.length, Environment.defaultEdge, true, !listViewStyle);

    R.forEach(i => R.addIndex<IVisibleColumn>(R.forEach)(
        (column, j) => {
            edges.setEdges(i, j, getFilterCellEdges(column)(styles));

            const ast = map.get(column.id.toString());
            if (ast && !ast.isValid) {
                edges.setEdges(i, j, {
                    borderBottom: [Environment.activeEdge, Infinity],
                    borderLeft: [Environment.activeEdge, Infinity],
                    borderRight: [Environment.activeEdge, Infinity],
                    borderTop: [Environment.activeEdge, Infinity]
                });
            }
        }, columns
    ), R.range(0, 1));

    return edges;
});