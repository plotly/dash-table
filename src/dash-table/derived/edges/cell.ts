import * as R from 'ramda';

import {
    IVisibleColumn,
    IViewportOffset,
} from 'dash-table/components/Table/props';
import {memoizeOneFactory} from 'core/memoizer';
import {IEdge} from 'dash-table/type/edge';

export const derivedVerticalEdges = memoizeOneFactory(
    (
        columns: IVisibleColumn[],
        data: any[],
        borderStyles: any[],
        offset: IViewportOffset
    ): IEdge[][] => {
        return data.map((datum, i) => {
            return [...columns, columns[columns.length - 1]].map(
                (col: IVisibleColumn, j, columnData: any) => {
                    const relevantStyle = R.filter(style => {
                        return (
                            style.matchesColumn(col) &&
                            style.matchesRow(i + offset.rows) &&
                            style.matchesFilter(datum)
                        );
                    }, borderStyles) as any;

                    let borderLeft: string = '1px solid #d3d3d3';
                    let borderRight: string = '1px solid #d3d3d3';
                    let precedence: Array<number> = [-1, -1];

                    R.forEach((s: any) => {
                        if (s.index && s.index > precedence[0]) {
                            if (s.style.border) {
                                precedence[0] = s.index;
                                precedence[1] = s.index;
                                borderLeft = s.style.border;
                                borderRight = s.style.border;
                            }
                        }
                        if (s.index && s.index > precedence[1]) {
                            if (s.style.borderRight) {
                                precedence[1] = s.index;
                                borderRight = s.style.borderRight;
                            }
                        }
                    }, relevantStyle);

                    // Look ahead at next cell
                    if (j + 1 <= columnData.length) {
                        const nextCol = columnData[j + 1];
                        if (nextCol) {
                            const nextRelevantStyle = R.filter(style => {
                                return (
                                    style.matchesColumn(nextCol) &&
                                    style.matchesRow(i + offset.rows) &&
                                    style.matchesFilter(datum)
                                );
                            }, borderStyles) as any;

                            R.forEach((s: any) => {
                                if (s.index && s.index > precedence[0]) {
                                    if (s.style.border) {
                                        // If next cell has a border with higher precedence, use that
                                        precedence[0] = s.index;
                                        precedence[1] = s.index;
                                        borderRight = s.style.border;
                                    }
                                }
                                if (s.index && s.index > precedence[1]) {
                                    // If next cell has a LEFT border with higher precedence, set that as
                                    // this cell's RIGHT border
                                    if (s.style.borderLeft) {
                                        precedence[1] = s.index;
                                        borderRight = s.style.borderLeft;
                                    }
                                }
                            }, nextRelevantStyle);
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
        return [...data, data[data.length - 1]].map((datum, i, mappedData) => {
            return columns.map((col: IVisibleColumn) => {
                const relevantStyle = R.filter(style => {
                    return (
                        style.matchesColumn(col) &&
                        style.matchesRow(i + offset.rows) &&
                        style.matchesFilter(datum)
                    );
                }, borderStyles) as any;

                let borderTop: string = '1px solid #d3d3d3';
                let borderBottom: string = '1px solid #d3d3d3';
                let precedence = [-1, -1];

                R.forEach((s: any) => {
                    if (s.index && s.index > precedence[0]) {
                        if (s.style.border) {
                            precedence[0] = s.index;
                            precedence[1] = s.index;
                            borderTop = s.style.border;
                            borderBottom = s.style.border;
                        }
                    }
                    if (s.index && s.index > precedence[1]) {
                        if (s.style.borderBottom) {
                            precedence[1] = s.index;
                            borderBottom = s.style.borderBottom;
                        }
                    }
                }, relevantStyle);

                // Look ahead at next cell
                if (i + 1 <= mappedData.length) {
                    const nextDatum = mappedData[i + 1];
                    if (nextDatum) {
                        const nextRelevantStyle = R.filter(style => {
                            return (
                                style.matchesColumn(col) &&
                                style.matchesRow(i + 1 + offset.rows) &&
                                style.matchesFilter(nextDatum)
                            );
                        }, borderStyles) as any;

                        R.forEach((s: any) => {
                            if (s.index && s.index > precedence[0]) {
                                if (s.style.borderTop) {
                                    precedence[0] = s.index;
                                    borderBottom = s.style.borderTop;
                                }
                            }
                        }, nextRelevantStyle);
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
