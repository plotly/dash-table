import * as R from 'ramda';

import Environment from 'core/environment';
import { memoizeOneFactory } from 'core/memoizer';

import {
    IVisibleColumn,
    VisibleColumns
} from 'dash-table/components/Table/props';

import { IConvertedStyle } from '../style';
import { EdgesMatrices } from './type';
import { getHeaderCellEdges } from '.';

export default memoizeOneFactory((
    columns: VisibleColumns,
    headerRows: number,
    styles: IConvertedStyle[],
    listViewStyle: boolean
) => {
    if (headerRows === 0 || columns.length === 0) {
        return;
    }

    const edges = new EdgesMatrices(headerRows, columns.length, Environment.defaultEdge, true, !listViewStyle);

    R.forEach(i => R.addIndex<IVisibleColumn>(R.forEach)((column, j) =>
        edges.setEdges(i, j, getHeaderCellEdges(i, column)(styles)),
        columns
    ), R.range(0, headerRows));

    return edges;
});