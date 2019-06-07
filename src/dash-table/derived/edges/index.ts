import * as R from 'ramda';

import { BorderStyle, BORDER_PROPERTIES, BorderProp, BORDER_PROPERTIES_AND_FRAGMENTS } from './type';
import { IConvertedStyle } from '../style';
import { Datum, IVisibleColumn } from 'dash-table/components/Table/props';
import { traverseReduce2 } from 'core/math/matrixZipMap';
import { CSSProperties } from 'react';

export type Filter<T> = (s: T[]) => T[];

export const matchesDataCell = (datum: Datum, i: number, column: IVisibleColumn): Filter<IConvertedStyle> => R.filter<IConvertedStyle>((style =>
    style.matchesRow(i) &&
    style.matchesColumn(column) &&
    style.matchesFilter(datum)
));

export const matchesFilterCell = (column: IVisibleColumn): Filter<IConvertedStyle> => R.filter<IConvertedStyle>((style =>
    style.matchesColumn(column)
));

export const matchesHeaderCell = (i: number, column: IVisibleColumn): Filter<IConvertedStyle> => R.filter<IConvertedStyle>((style =>
    style.matchesRow(i) &&
    style.matchesColumn(column)
));

export const matchesDataOpCell = (datum: Datum, i: number): Filter<IConvertedStyle> => R.filter<IConvertedStyle>((style =>
    !style.checksColumn() &&
    style.matchesRow(i) &&
    style.matchesFilter(datum)
));

const getFilterOpStyles: Filter<IConvertedStyle> = R.filter<IConvertedStyle>((style =>
    !style.checksColumn()
));

const getHeaderOpStyles = (i: number): Filter<IConvertedStyle> => R.filter<IConvertedStyle>((style =>
    style.matchesRow(i) &&
    !style.checksColumn()
));

const applyEdge = (
    base: BorderStyle,
    style: IConvertedStyle,
    p: BorderProp,
    i: number
) => R.ifElse(
    R.compose(R.not, R.isNil),
    s => (base[p] = [s, i]) && base,
    () => base)(style.style[p] || style.style.border);

const applyEdges = (styles: IConvertedStyle[]): BorderStyle => {
    return traverseReduce2(
        styles,
        BORDER_PROPERTIES,
        applyEdge,
        {}
    );
};

export const resolveStyle = (filter: Filter<IConvertedStyle>) => R.compose(
    R.mergeAll,
    R.map<IConvertedStyle, CSSProperties>(R.compose(
        R.omit(BORDER_PROPERTIES_AND_FRAGMENTS),
        R.prop('style')
    )),
    filter
) as (s: IConvertedStyle[]) => CSSProperties;

export const getDataCellStyle = (datum: Datum, i: number, column: IVisibleColumn) => resolveStyle(matchesDataCell(datum, i, column));
export const getDataOpCellStyle = (datum: Datum, i: number) => resolveStyle(matchesDataOpCell(datum, i));

export const getDataCellEdges = (datum: Datum, i: number, column: IVisibleColumn) => R.compose(applyEdges, matchesDataCell(datum, i, column));
export const getDataOpCellEdges = (datum: Datum, i: number) => R.compose(applyEdges, matchesDataOpCell(datum, i));
export const getFilterCellEdges = (column: IVisibleColumn) => R.compose(applyEdges, matchesFilterCell(column));
export const getFilterOpCellEdges = () => R.compose(applyEdges, getFilterOpStyles);
export const getHeaderCellEdges = (i: number, column: IVisibleColumn) => R.compose(applyEdges, matchesHeaderCell(i, column));
export const getHeaderOpCellEdges = (i: number) => R.compose(applyEdges, getHeaderOpStyles(i));