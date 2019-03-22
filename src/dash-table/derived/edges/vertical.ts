import * as R from 'ramda';

import {
    IVisibleColumn,
    IViewportOffset,
} from 'dash-table/components/Table/props';
import {memoizeOneFactory} from 'core/memoizer';
import {IVerticalEdge} from 'dash-table/type/edge';

export const derivedVerticalEdges = memoizeOneFactory(
    (
        columns: IVisibleColumn[],
        data: any[],
        borderStyles: any[],
        offset: IViewportOffset
    ): IVerticalEdge[][] => {
        return data.map((datum, i) => {
            return [...columns, columns[columns.length - 1]].map(
                (col: IVisibleColumn, j, mappedColumns) => {
                    const relevantStyle = R.filter(style => {
                        return (
                            (style.matchesColumn(col) &&
                                style.matchesRow(i + offset.rows) &&
                                style.matchesFilter(datum)) ||
                            (j > 0 &&
                                style.matchesColumn(mappedColumns[j - 1]) &&
                                style.matchesRow(i + offset.rows) &&
                                style.matchesFilter(data[i - 1]))
                        );
                    }, borderStyles) as any;
                    const index = relevantStyle.length - 1;
                    if (
                        (relevantStyle[index].style &&
                            R.has('border', relevantStyle[index].style)) ||
                        R.has('borderTop', relevantStyle[index].style) ||
                        R.has('borderRight', relevantStyle[index].style) ||
                        R.has('borderBottom', relevantStyle[index].style) ||
                        R.has('borderLeft', relevantStyle[index].style)
                    ) {
                        // TO-DO: different border styles such as top, left, etc
                        // R.pick()
                        const bs = relevantStyle[index].style;
                        return {border: bs.border || bs.borderTop};
                    }
                    return {} as IVerticalEdge;
                }
            );
        });
    }
);

export const derivedHorizontalEdges = memoizeOneFactory(
    (
        columns: IVisibleColumn[],
        data: any[],
        borderStyles: any[],
        offset: IViewportOffset
    ): IVerticalEdge[][] => {
        return [...data, data[data.length - 1]].map((datum, i, mappedData) => {
            return columns.map((col: IVisibleColumn) => {
                const relevantStyle = R.filter(style => {
                    return (
                        (style.matchesColumn(col) &&
                            style.matchesRow(i + offset.rows) &&
                            style.matchesFilter(datum)) ||
                        (i > 0 &&
                            style.matchesColumn(col) &&
                            style.matchesRow(i + offset.rows - 1) &&
                            style.matchesFilter(mappedData[i - 1]))
                    );
                }, borderStyles) as any;
                const index = relevantStyle.length - 1;
                if (
                    (relevantStyle[index].style &&
                        R.has('border', relevantStyle[index].style)) ||
                    R.has('borderTop', relevantStyle[index].style) ||
                    R.has('borderRight', relevantStyle[index].style) ||
                    R.has('borderBottom', relevantStyle[index].style) ||
                    R.has('borderLeft', relevantStyle[index].style)
                ) {
                    const bs = relevantStyle[index].style;
                    return {border: bs.border || bs.borderTop};
                }
                return {} as IVerticalEdge;
            });
        });
    }
);
