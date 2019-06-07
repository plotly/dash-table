import * as R from 'ramda';

import Environment from 'core/environment';
import { memoizeOneFactory } from 'core/memoizer';

import {
    IVisibleColumn,
    VisibleColumns
} from 'dash-table/components/Table/props';

import { IConvertedStyle, matchesHeaderCell } from '../style';
import { EdgesMatrices } from './type';
import { getBorderStyle } from '.';

export default memoizeOneFactory((
    columns: VisibleColumns,
    headerRows: number,
    borderStyles: IConvertedStyle[],
    listViewStyle: boolean
) => {
    if (headerRows === 0 || columns.length === 0) {
        return;
    }

    const edges = new EdgesMatrices(headerRows, columns.length, Environment.defaultEdge, true, !listViewStyle);

    R.forEach(i => {
        const partial = matchesHeaderCell(i);

        return R.addIndex<IVisibleColumn>(R.forEach)(
            (column, j) => {
                const matcher = partial(column);

                const cellStyle = getBorderStyle(
                    matcher(borderStyles)
                );

                edges.setEdges(i, j, cellStyle);
            }, columns);
    }, R.range(0, headerRows));

    return edges;
});