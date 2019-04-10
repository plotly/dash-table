import * as R from 'ramda';
import {CSSProperties} from 'react';

import {memoizeOneFactory} from 'core/memoizer';

import {
    VisibleColumns,
    IVisibleColumn,
} from 'dash-table/components/Table/props';

import {IConvertedStyle} from '../style';

import {IEdge} from 'dash-table/type/edge';

type Style = CSSProperties | undefined;

function getter(
    columns: VisibleColumns,
    headerRows: number,
    headerStyles: IConvertedStyle[],
    vertical_edges: IEdge[][],
    horizontal_edges: IEdge[][],
    has_operations: boolean
): Style[][] {
    return R.map(
        colIndex =>
            R.addIndex<IVisibleColumn, Style>(R.map)(
                (column: IVisibleColumn, index: number) => {
                    const relevantStyles = R.map(
                        s => s.style,
                        R.filter(
                            style =>
                                style.matchesColumn(column) &&
                                style.matchesRow(colIndex),
                            headerStyles
                        )
                    );

                    const vertical_edge = vertical_edges[colIndex][0];

                    const horizontal_edge = horizontal_edges[colIndex][0];

                    relevantStyles.push({
                        borderTop: horizontal_edge.borders[0],
                        borderRight: vertical_edge.borders[1],
                        borderLeft:
                            !has_operations && index === 0
                                ? vertical_edge.borders[0]
                                : '',
                    });
                    return relevantStyles.length
                        ? R.mergeAll(relevantStyles)
                        : undefined;
                },
                columns
            ),
        R.range(0, headerRows)
    );
}

export default memoizeOneFactory(getter);
