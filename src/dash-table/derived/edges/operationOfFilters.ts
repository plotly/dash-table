import * as R from 'ramda';

import Environment from 'core/environment';
import { memoizeOneFactory } from 'core/memoizer';

import { IConvertedStyle } from '../style';
import { BorderStyle, BORDER_PROPERTIES, EdgesMatrices } from './type';

const getWeightedStyle = (
    borderStyles: IConvertedStyle[]
): BorderStyle => {
    const res: BorderStyle = {};

    R.addIndex<IConvertedStyle>(R.forEach)((rs, i) => {
        if (!rs.matchesColumn(undefined)) {
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
    filtering: boolean,
    borderStyles: IConvertedStyle[]
) => {
    if (!filtering || columns === 0) {
        return;
    }

    const edges = new EdgesMatrices(1, columns, Environment.defaultEdge);

    R.forEach(i =>
        R.forEach(j => {
            const cellStyle = getWeightedStyle(borderStyles);

            edges.setEdges(i, j, cellStyle);
        },
            R.range(0, columns)
        ),
        R.range(0, 1)
    );

    return edges;
});