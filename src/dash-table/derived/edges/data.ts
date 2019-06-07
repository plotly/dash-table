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
import { toMatrix } from 'core/math/matrixZipMap';

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

    toMatrix(
        R.addIndex(R.forEach)((datum, i) => matchesCell(datum, i + offset.rows), data),
        columns,
        (rowMatcher: any, column: IVisibleColumn, i: number, j: number) => edges.setEdges(i, j, getBorderStyle(rowMatcher(column)(borderStyles)))
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