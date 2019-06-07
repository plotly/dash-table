import * as R from 'ramda';

import Environment from 'core/environment';
import { memoizeOneFactory } from 'core/memoizer';

import { IConvertedStyle, matchesFilterOpCell } from '../style';
import { EdgesMatrices } from './type';
import { getBorderStyle } from '.';

export default memoizeOneFactory((
    columns: number,
    filter_action: boolean,
    borderStyles: IConvertedStyle[],
    listViewStyle: boolean
) => {
    if (!filter_action || columns === 0) {
        return;
    }

    const edges = new EdgesMatrices(1, columns, Environment.defaultEdge, true, !listViewStyle);

    const cellStyle = getBorderStyle(
        matchesFilterOpCell(borderStyles)
    );

    R.forEach(i =>
        R.forEach(
            j => edges.setEdges(i, j, cellStyle),
            R.range(0, columns)
        ),
        R.range(0, 1)
    );

    return edges;
});