import * as R from 'ramda';
import {CSSProperties} from 'react';

import {memoizeOneFactory} from 'core/memoizer';
import {
    Data,
    VisibleColumns,
    IViewportOffset,
    IVisibleColumn,
} from 'dash-table/components/Table/props';
import {IConvertedStyle} from '../style';
import {IVerticalEdge} from 'dash-table/type/edge';

type Style = CSSProperties | undefined;

function getter(
    columns: VisibleColumns,
    columnStyles: IConvertedStyle[],
    data: Data,
    offset: IViewportOffset,
    vertical_edges: IVerticalEdge[][],
    horizontal_edges: IVerticalEdge[][]
): Style[][] {
    return R.addIndex<any, Style[]>(R.map)(
        (datum, index) =>
            R.addIndex<IVisibleColumn, Style | undefined>(R.map)(
                (column, colIndex) => {
                    // get associated verical edges
                    const relevantStyles = R.map(
                        s => s.style,
                        R.filter(
                            style =>
                                style.matchesColumn(column) &&
                                style.matchesRow(index + offset.rows) &&
                                style.matchesFilter(datum),
                            columnStyles
                        )
                    );

                    const vertical_edge = vertical_edges[index][colIndex];
                    const next_vertical = vertical_edges[index][colIndex+1];

                    const horizontal_edge = horizontal_edges[index][colIndex];
                    const next_horizontal = horizontal_edges[index+1][colIndex];

                    relevantStyles.push({
                        borderLeft: vertical_edge.border,
                        borderTop: horizontal_edge.border,
                        borderRight: next_vertical ? next_vertical.border : '',
                        borderBottom: next_horizontal.border,
                    });

                    return relevantStyles.length
                        ? R.mergeAll(relevantStyles)
                        : undefined;
                },
                columns
            ),
        data
    );
}

export default memoizeOneFactory(getter);
