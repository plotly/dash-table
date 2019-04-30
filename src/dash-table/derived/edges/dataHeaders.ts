import * as R from 'ramda';

import { memoizeOneFactory } from 'core/memoizer';

import { IConvertedStyle } from '../style';
import { BorderStyle, BORDER_PROPERTIES, Edges, EdgesMatrices, IDefaultBorderStyle } from './type';

const getWeightedStyle = (
    borderStyles: IConvertedStyle[],
    index: number
): BorderStyle => {
    const res: BorderStyle = {};

    R.addIndex<IConvertedStyle>(R.forEach)((rs, i) => {
        if (!rs.matchesRow(index)) {
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
    headerRows: number,
    borderStyles: IConvertedStyle[],
    defaultBorderStyle?: IDefaultBorderStyle
): Edges => {
    if (headerRows === 0 || columns === 0) {
        return;
    }

    const edges = new EdgesMatrices(headerRows, columns, defaultBorderStyle);

    R.forEach(i =>
        R.forEach(j => {
                const cellStyle = getWeightedStyle(
                    borderStyles,
                    i
                );

                edges.setEdges(i, j, cellStyle);
            },
            R.range(0, columns)
        ),
        R.range(0, headerRows)
    );

    return edges.getMatrices();
});