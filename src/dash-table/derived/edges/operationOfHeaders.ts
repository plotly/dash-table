import * as R from 'ramda';

import Environment from 'core/environment';
import { memoizeOneFactory } from 'core/memoizer';

import { IConvertedStyle, matchesHeaderOpCell } from '../style';
import { EdgesMatrices } from './type';
import { getBorderStyle } from '.';

export default memoizeOneFactory((
    columns: number,
    headerRows: number,
    borderStyles: IConvertedStyle[],
    listViewStyle: boolean
) => {
    if (headerRows === 0 || columns === 0) {
        return;
    }

    const edges = new EdgesMatrices(headerRows, columns, Environment.defaultEdge, true, !listViewStyle);

    R.forEach(i => {
        const matcher = matchesHeaderOpCell(i);

        const cellStyle = getBorderStyle(
            matcher(borderStyles)
        );

        R.forEach(
            j => edges.setEdges(i, j, cellStyle),
            R.range(0, columns)
        );
    }, R.range(0, headerRows));

    return edges;
});