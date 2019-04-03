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

                    let borderStyle: any = '1px solid #d3d3d3';

                    R.forEach((s: any) => {
                        if (s.style.border) {
                            borderStyle = s.style.border;
                        }
                        if (s.style.borderRight) {
                            borderStyle = s.style.borderRight;
                        }
                    }, relevantStyle);

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
                                if (s.style.border) {
                                    borderStyle = s.style.border;
                                }
                                if (s.style.borderLeft) {
                                    borderStyle = s.style.borderLeft;
                                }
                            }, nextRelevantStyle);
                        }
                    }

                    return {
                        border: borderStyle,
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

                let borderStyle: any = '1px solid #d3d3d3';
                let position: string = 'border';

                R.forEach((s: any) => {
                    if (s.style.border) {
                        borderStyle = s.style.border;
                        position = 'border';
                    }
                    if (s.style.borderBottom) {
                        borderStyle = s.style.borderBottom;
                        position = 'bottom';
                    }
                }, relevantStyle);

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
                            if (position !== 'border' && s.style.border) {
                                borderStyle = s.style.border;
                                position = 'border';
                            }
                            if (s.style.borderTop) {
                                borderStyle = s.style.borderTop;
                                position = 'left';
                            }
                        }, nextRelevantStyle);
                    }
                }

                return {
                    border: borderStyle,
                };
            });
        });
    }
);
