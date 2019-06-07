import * as R from 'ramda';

import Environment from 'core/environment';
import { memoizeOneFactory } from 'core/memoizer';

import {
    IViewportOffset,
    IVisibleColumn,
    VisibleColumns,
    Data,
    ICellCoordinates
} from 'dash-table/components/Table/props';

import { IConvertedStyle, matchesDataCell } from '../style';
import { EdgesMatrices } from './type';
import { getBorderStyle } from '.';

export default memoizeOneFactory((
    columns: VisibleColumns,
    borderStyles: IConvertedStyle[],
    data: Data,
    offset: IViewportOffset,
    active_cell: ICellCoordinates | undefined,
    listViewStyle: boolean
) => {
    if (data.length === 0 || columns.length === 0) {
        return;
    }

    const edges = new EdgesMatrices(data.length, columns.length, Environment.defaultEdge, true, !listViewStyle);

    R.addIndex(R.forEach)((datum, i) => {
        const partial = matchesDataCell(datum, i + offset.rows);

        return R.addIndex<IVisibleColumn>(R.forEach)((column, j) => {
            const matcher = partial(column);

            const cellStyle = getBorderStyle(
                matcher(borderStyles)
            );

            edges.setEdges(i, j, cellStyle);
        }, columns);
    }, data);

    if (active_cell) {
        edges.setEdges(active_cell.row, active_cell.column, {
            borderBottom: [Environment.activeEdge, Infinity],
            borderLeft: [Environment.activeEdge, Infinity],
            borderRight: [Environment.activeEdge, Infinity],
            borderTop: [Environment.activeEdge, Infinity]
        });
    }

    return edges;
});