import * as R from 'ramda';

import Environment from 'core/environment';
import { memoizeOneFactory } from 'core/memoizer';

import {
    Data,
    IViewportOffset
} from 'dash-table/components/Table/props';

import { IConvertedStyle, matchesDataOpCell } from '../style';
import { EdgesMatrices } from './type';
import { getBorderStyle } from '.';

export default memoizeOneFactory((
    columns: number,
    borderStyles: IConvertedStyle[],
    data: Data,
    offset: IViewportOffset,
    listViewStyle: boolean
) => {
    if (data.length === 0 || columns === 0) {
        return;
    }

    const edges = new EdgesMatrices(data.length, columns, Environment.defaultEdge, true, !listViewStyle);

    R.addIndex(R.forEach)((datum, i) => {
        const matcher = matchesDataOpCell(datum, i + offset.rows);

        const cellStyle = getBorderStyle(
            matcher(borderStyles)
        );

        R.forEach(
            j => edges.setEdges(i, j, cellStyle),
            R.range(0, columns)
        );
    }, data);

    return edges;
});