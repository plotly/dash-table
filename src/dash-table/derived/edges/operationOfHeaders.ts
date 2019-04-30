import * as R from 'ramda';

import { memoizeOneFactory } from 'core/memoizer';

import { IConvertedStyle } from '../style';
import { BorderStyle, BORDER_PROPERTIES, EdgesMatrices } from './type';

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
    isLastRow: boolean,
    borderStyles: IConvertedStyle[]
) => {
    if (headerRows === 0 || columns === 0) {
        return;
    }

    const edges = new EdgesMatrices(headerRows, columns);
    const iNull = isLastRow ? -1 : headerRows - 1;

    R.forEach(i =>
        R.forEach(j => {
            const cellStyle = getWeightedStyle(
                borderStyles,
                i
            );

            if (i === iNull) {
                cellStyle.borderBottom = undefined;
            }

            edges.setEdges(i, j, cellStyle);
        },
            R.range(0, columns)
        ),
        R.range(0, headerRows)
    );

    return edges;
});