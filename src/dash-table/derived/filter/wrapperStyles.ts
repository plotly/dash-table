import * as R from 'ramda';
import {CSSProperties} from 'react';

import {memoizeOneFactory} from 'core/memoizer';

import {
    Data,
    VisibleColumns,
    IVisibleColumn,
} from 'dash-table/components/Table/props';

import {IConvertedStyle} from '../style';
import {IEdge} from 'dash-table/type/edge';

type Style = CSSProperties | undefined;

function getter(
    columns: VisibleColumns,
    data: Data,
    filterStyles: IConvertedStyle[],
    vertical_edges: IEdge[][],
    horizontal_edges: IEdge[][]
): Style[] {
    return R.addIndex(R.map)(
        (_, index) =>
            R.addIndex<IVisibleColumn, Style>(R.map)((column, colIndex) => {
                const relevantStyles = R.map(
                    s => s.style,
                    R.filter(style => style.matchesColumn(column), filterStyles)
                );
                const vertical_edge = vertical_edges[index][colIndex];

                const horizontal_edge = horizontal_edges[index][colIndex];

                relevantStyles.push({
                    borderLeft: colIndex === 0 ? vertical_edge.borders[0] : '',
                    borderTop: index === 0 ? horizontal_edge.borders[0] : '',
                    borderRight: vertical_edge.borders[0],
                    borderBottom: horizontal_edge.borders[0],
                });

                return relevantStyles.length
                    ? R.mergeAll(relevantStyles)
                    : undefined;
            }, columns),
        data
    );
}

export default memoizeOneFactory(getter);
