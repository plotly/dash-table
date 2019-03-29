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
                (col: IVisibleColumn, j) => {
                    const relevantStyle = R.filter(style => {
                        return (
                            (style.matchesColumn(col) &&
                                style.matchesRow(i + offset.rows) &&
                                style.matchesFilter(datum))
                        );
                    }, borderStyles) as any;

                    let borderStyle: any = '1px solid grey';
                    let position: string = '';

                    R.forEach((s: any) => {
                        if (s.style.borderLeft) console.log(i, j, s);
                        if (s.style.border) {
                            borderStyle = s.style.border;
                            position = 'border';
                        }
                        if (s.style.borderLeft) {
                            borderStyle = s.style.borderLeft;
                            position = 'left';
                        }
                        if (s.style.borderRight) {
                            borderStyle = s.style.borderRight;
                            position = 'right';
                        }
                    }, relevantStyle);

                    return {
                        border: borderStyle,
                        position: position,
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
    ): IVerticalEdge[][] => {
        return [...data, data[data.length - 1]].map((datum, i) => {
            return columns.map((col: IVisibleColumn) => {
                const relevantStyle = R.filter(style => {
                    return (
                        (style.matchesColumn(col) &&
                            style.matchesRow(i + offset.rows) &&
                            style.matchesFilter(datum))
                    );
                }, borderStyles) as any;

                let borderStyle: any = '1px solid grey';
                let position: string = '';

                R.forEach((s: any) => {
                    if (s.style.border) {
                        borderStyle= s.style.border;
                        position = 'border';
                    }
                    if (s.style.borderTop) {
                        borderStyle= s.style.borderTop;
                        position = 'top';
                    }
                    if (s.style.borderBottom) {
                        borderStyle= s.style.borderBottom;
                        position = 'bottom';
                    }
                }, relevantStyle);

                return {
                    border: borderStyle,
                    position: position,
                };
            });
        });
    }
);
