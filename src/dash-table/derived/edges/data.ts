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

import { IConvertedStyle, matchesCell } from '../style';
import { BorderStyle, BORDER_PROPERTIES, EdgesMatrices, BorderProp } from './type';

const indexedMap = <T>(a: T[]) => R.addIndex<T, [T, number]>(R.map)((e: T, i: number) => [e, i], a);

const getBorderStyle = (styles: IConvertedStyle[]): BorderStyle => R.reduce(
    (res: BorderStyle, [style, i]) => R.reduce(
        (acc: BorderStyle, p: BorderProp): BorderStyle =>
            R.ifElse(
                R.compose(R.not, R.isNil),
                s => (acc[p] = [s, i]) && acc,
                () => acc
            )(style.style[p] || style.style.border),
        res,
        BORDER_PROPERTIES
    ), {}, indexedMap(styles));

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
        const partialCellMatcher = matchesCell(datum, i + offset.rows);

        return R.addIndex<IVisibleColumn>(R.forEach)(
            (column, j) => {
                const cellMatcher = partialCellMatcher(column);

                const cellStyle = getBorderStyle(
                    cellMatcher(borderStyles)
                );

                edges.setEdges(i, j, cellStyle);
            },
            columns
        );
    },
        data
    );

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