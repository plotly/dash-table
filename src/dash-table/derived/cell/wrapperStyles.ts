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
import {IEdge} from 'dash-table/type/edge';

type Style = CSSProperties | undefined;

function getter(
    columns: VisibleColumns,
    columnStyles: IConvertedStyle[],
    data: Data,
    offset: IViewportOffset,
    vertical_edges: IEdge[][],
    horizontal_edges: IEdge[][],
    has_operations: boolean
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

                    const horizontal_edge = horizontal_edges[index][colIndex];

                    relevantStyles.push({
                        borderLeft: !has_operations
                            ? vertical_edge.borders[0]
                            : '',
                        borderRight: vertical_edge.borders[1],
                        borderTop: horizontal_edge.borders[0],
                        borderBottom: horizontal_edge.borders[1],
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
