import * as R from 'ramda';

import {
    IVisibleColumn,
    IViewportOffset,
} from 'dash-table/components/Table/props';
import {memoizeOneFactory} from 'core/memoizer';
import {IEdge} from 'dash-table/type/edge';

const getRelevantBorderStyle = (
    borderStyles: any[],
    column: IVisibleColumn,
    index: number,
    offset: IViewportOffset,
    datum: any
) =>
    R.filter(style => {
        return (
            style.matchesColumn(column) &&
            style.matchesRow(index + offset.rows) &&
            style.matchesFilter(datum)
        );
    }, borderStyles);

const defaultBorderStyle = `1px solid #d3d3d3`;

export const derivedVerticalEdges = memoizeOneFactory(
    (
        columns: IVisibleColumn[],
        data: any[],
        borderStyles: any[],
        offset: IViewportOffset
    ): IEdge[][] => {
        return data.map((datum, i) => {
            return [...columns, {} as IVisibleColumn].map(
                (col: IVisibleColumn, j, columnData: any) => {
                    const relevantStyle = getRelevantBorderStyle(
                        borderStyles,
                        col,
                        i,
                        offset,
                        datum
                    );

                    let borderLeft: string = defaultBorderStyle;
                    let borderRight: string = defaultBorderStyle;
                    let precedence: Array<number> = [-1, -1];

                    R.forEach((s: any) => {
                        if (s.index > precedence[0] && s.style.border) {
                            precedence[0] = s.index;
                            precedence[1] = s.index;
                            borderLeft = s.style.border;
                            borderRight = s.style.border;
                        }
                        if (s.index > precedence[0] && s.style.borderRight) {
                            precedence[0] = s.index;
                            borderLeft = s.style.borderLeft;
                        }
                        if (s.index > precedence[1] && s.style.borderRight) {
                            precedence[1] = s.index;
                            borderRight = s.style.borderRight;
                        }
                    }, R.filter(s => !R.isEmpty(s.style), relevantStyle));

                    // Look ahead at next cell
                    if (j + 1 <= columnData.length) {
                        const nextCol = columnData[j + 1];
                        if (nextCol) {
                            const nextRelevantStyle = getRelevantBorderStyle(
                                borderStyles,
                                nextCol,
                                i,
                                offset,
                                datum
                            );

                            R.forEach((s: any) => {
                                // If next cell has a border with higher precedence, use that
                                if (s.index > precedence[0] && s.style.border) {
                                    precedence[0] = s.index;
                                    precedence[1] = s.index;
                                    borderRight = s.style.border;
                                }
                                // If next cell has a LEFT border with higher precedence, set that as
                                // this cell's RIGHT border
                                if (
                                    s.index > precedence[1] &&
                                    s.style.borderLeft
                                ) {
                                    precedence[1] = s.index;
                                    borderRight = s.style.borderLeft;
                                }
                            }, R.filter(s => !R.isEmpty(s.style), nextRelevantStyle));
                        }
                    }

                    return {
                        borders: [borderLeft, borderRight],
                        precedence,
                    };
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
    ): IEdge[][] => {
        return [...data, {}].map((datum, i, mappedData) => {
            return columns.map((col: IVisibleColumn) => {
                const relevantStyle = getRelevantBorderStyle(
                    borderStyles,
                    col,
                    i,
                    offset,
                    datum
                );

                let borderTop: string = defaultBorderStyle;
                let borderBottom: string = defaultBorderStyle;
                let precedence = [-1, -1];

                R.forEach((s: any) => {
                    if (s.index > precedence[0] && s.style.border) {
                        precedence[0] = s.index;
                        precedence[1] = s.index;
                        borderTop = s.style.border;
                        borderBottom = s.style.border;
                    }
                    if (s.index > precedence[0] && s.style.borderTop) {
                        precedence[0] = s.index;
                        borderTop = s.style.borderTop;
                    }
                    if (s.index > precedence[1] && s.style.borderBottom) {
                        precedence[1] = s.index;
                        borderBottom = s.style.borderBottom;
                    }
                }, R.filter(s => !R.isEmpty(s.style), relevantStyle));

                // Look ahead at next cell
                if (i + 1 <= mappedData.length) {
                    const nextDatum = mappedData[i + 1];
                    if (nextDatum) {
                        const nextRelevantStyle = getRelevantBorderStyle(
                            borderStyles,
                            col,
                            i,
                            offset,
                            nextDatum
                        );

                        R.forEach((s: any) => {
                            if (s.index > precedence[0] && s.style.borderTop) {
                                precedence[0] = s.index;
                                borderBottom = s.style.borderTop;
                            }
                        }, R.filter(s => !R.isEmpty(s.style), nextRelevantStyle));
                    }
                }
                return {
                    borders: [borderTop, borderBottom],
                    precedence,
                };
            });
        });
    }
);
