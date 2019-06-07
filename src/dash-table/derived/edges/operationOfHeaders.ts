import * as R from 'ramda';

import Environment from 'core/environment';
import { memoizeOneFactory } from 'core/memoizer';

import { IConvertedStyle } from '../style';
import { EdgesMatrices } from './type';
import { getHeaderOpCellEdges } from '.';

export default memoizeOneFactory((
    columns: number,
    headerRows: number,
    styles: IConvertedStyle[],
    listViewStyle: boolean
) => {
    if (headerRows === 0 || columns === 0) {
        return;
    }

    const edges = new EdgesMatrices(headerRows, columns, Environment.defaultEdge, true, !listViewStyle);

    R.forEach(i => R.forEach(
        j => edges.setEdges(i, j, getHeaderOpCellEdges(i)(styles)),
        R.range(0, columns)
    ), R.range(0, headerRows));

    return edges;
});