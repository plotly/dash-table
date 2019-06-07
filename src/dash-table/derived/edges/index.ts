import * as R from 'ramda';

import { BorderStyle, BORDER_PROPERTIES, BorderProp } from './type';
import { IConvertedStyle } from '../style';
import { Datum, IVisibleColumn } from 'dash-table/components/Table/props';

const indexedMap = <T>(a: T[]) => R.addIndex<T, [T, number]>(R.map)((e: T, i: number) => [e, i], a);

export const matchesDataCell = (datum: Datum, i: number, column: IVisibleColumn) => R.filter<IConvertedStyle>((style =>
    style.matchesRow(i) &&
    style.matchesColumn(column) &&
    style.matchesFilter(datum)
));

export const matchesFilterCell = (column: IVisibleColumn) => R.filter<IConvertedStyle>((style =>
    style.matchesColumn(column)
));

export const matchesHeaderCell = (i: number, column: IVisibleColumn) => R.filter<IConvertedStyle>((style =>
    style.matchesRow(i) &&
    style.matchesColumn(column)
));

export const matchesDataOpCell = (datum: Datum, i: number) => R.filter<IConvertedStyle>((style =>
    !style.checksColumn() &&
    style.matchesRow(i) &&
    style.matchesFilter(datum)
));

const getFilterOpStyles = R.filter<IConvertedStyle>((style =>
    !style.checksColumn()
));

const getHeaderOpStyles = (i: number) => R.filter<IConvertedStyle>((style =>
    style.matchesRow(i) &&
    !style.checksColumn()
));

const getBorderStyle = (styles: IConvertedStyle[]): BorderStyle => R.reduce(
    (res: BorderStyle, [style, i]) => R.reduce(
        (acc: BorderStyle, p: BorderProp): BorderStyle =>
            R.ifElse(
                R.compose(R.not, R.isNil),
                s => (acc[p] = [s, i]) && acc,
                () => acc
            )(style.style[p] || style.style.border),
        res,
        BORDER_PROPERTIES
    ), {}, indexedMap(styles));

const getEdge = (filter: R.FilterOnceApplied<IConvertedStyle>) =>
    (styles: IConvertedStyle[]) =>
        getBorderStyle(filter(styles));

export const getDataCellEdges = (datum: Datum, i: number, column: IVisibleColumn) => getEdge(matchesDataCell(datum, i, column));
export const getDataOpCellEdges = (datum: Datum, i: number) => getEdge(matchesDataOpCell(datum, i));
export const getFilterCellEdges = (column: IVisibleColumn) => getEdge(matchesFilterCell(column));
export const getFilterOpCellEdges = () => getEdge(getFilterOpStyles);
export const getHeaderCellEdges = (i: number, column: IVisibleColumn) => getEdge(matchesHeaderCell(i, column));
export const getHeaderOpCellEdges = (i: number) => getEdge(getHeaderOpStyles(i));