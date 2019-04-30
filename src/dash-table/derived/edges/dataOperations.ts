import * as R from 'ramda';

import { memoizeOneFactory } from 'core/memoizer';

import {
    Data,
    IViewportOffset
} from 'dash-table/components/Table/props';

import { IConvertedStyle } from '../style';
import { BorderStyle, BORDER_PROPERTIES, Edges, EdgesMatrices, IDefaultBorderStyle } from './type';

const getWeightedStyle = (
    borderStyles: IConvertedStyle[],
    index: number,
    offset: IViewportOffset,
    datum: any
): BorderStyle => {
    const res: BorderStyle = {};

    R.addIndex<IConvertedStyle>(R.forEach)((rs, i) => {
        if (!rs.matchesRow(index + offset.rows) ||
            !rs.matchesFilter(datum)
        ) {
            return;
        }

        R.forEach(p => {
            const s = rs.style[p] || rs.style.border;

            if (!R.isNil(s)) {
                res[p] = [s, i];
            }
        }, BORDER_PROPERTIES);
    }, borderStyles);

    return res;
};

export default memoizeOneFactory((
    columns: number,
    data: Data,
    borderStyles: IConvertedStyle[],
    offset: IViewportOffset,
    defaultBorderStyle?: IDefaultBorderStyle
): Edges => {
    if (data.length === 0 || columns === 0) {
        return;
    }

    const edges = new EdgesMatrices(data.length, columns, defaultBorderStyle);

    R.addIndex(R.forEach)((datum, i) =>
        R.forEach(j => {
                const cellStyle = getWeightedStyle(
                    borderStyles,
                    i,
                    offset,
                    datum
                );

                edges.setEdges(i, j, cellStyle);
            },
            R.range(0, columns)
        ),
        data
    );

    return edges.getMatrices();
});