import * as R from 'ramda';

import { memoizeOneFactory } from 'core/memoizer';

import {
    IVisibleColumn,
    VisibleColumns
} from 'dash-table/components/Table/props';

import { IConvertedStyle } from '../style';
import { BorderStyle, BORDER_PROPERTIES, Edges, EdgesMatrices, IDefaultBorderStyle } from './type';

const getWeightedStyle = (
    borderStyles: IConvertedStyle[],
    column: IVisibleColumn
): BorderStyle => {
    const res: BorderStyle = {};

    R.addIndex<IConvertedStyle>(R.forEach)((rs, i) => {
        if (!rs.matchesColumn(column)) {
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
    columns: VisibleColumns,
    showFilters: boolean,
    borderStyles: IConvertedStyle[],
    defaultBorderStyle?: IDefaultBorderStyle
): Edges => {
    if (!showFilters || columns.length === 0) {
        return;
    }

    const edges = new EdgesMatrices(1, columns.length, defaultBorderStyle);

    R.forEach(i =>
        R.addIndex<IVisibleColumn>(R.forEach)(
            (column, j) => {
                const cellStyle = getWeightedStyle(
                    borderStyles,
                    column
                );

                edges.setEdges(i, j, cellStyle);
            },
            columns
        ),
        R.range(0, 1)
    );

    return edges.getMatrices();
});