import * as R from 'ramda';
import { CSSProperties } from 'react';

import { memoizeOneFactory } from 'core/memoizer';

import { Datum, IColumn } from 'dash-table/components/Table/props';

import {
    Cells,
    DataCells,
    BasicFilters,
    Headers,
    Style,
    Table
} from './props';
import converter, { StyleProperty } from './py2jsCssProperties';

import {
    IConditionalElement,
    IIndexedHeaderElement,
    IIndexedRowElement,
    INamedElement,
    ITypedElement,
    IEditableElement,
    ifColumnId,
    ifColumnType,
    ifEditable,
    ifColumnStateActive,
    IStateElement,
    ifColumnStateSelected
 } from 'dash-table/conditional';
import { QuerySyntaxTree } from 'dash-table/syntax-tree';
import { BORDER_PROPERTIES_AND_FRAGMENTS } from '../edges/type';
import { matchesDataCell, matchesDataOpCell, matchesFilterCell, getFilterOpStyles, matchesHeaderCell, getHeaderOpStyles } from 'dash-table/conditional';

export interface IConvertedStyle {
    style: CSSProperties;
    checksColumn: () => boolean;
    checksRow: () => boolean;
    checksFilter: () => boolean;
    checksState: () => boolean;
    checksStateActive: () => boolean;
    checksStateSelected: () => boolean;
    matchesActive: (active: boolean) => boolean;
    matchesColumn: (column: IColumn | undefined) => boolean;
    matchesFilter: (datum: Datum) => boolean;
    matchesRow: (index: number | undefined) => boolean;
    matchesSelected: (selected: boolean) => boolean;
}

type GenericIf = Partial<IStateElement & IConditionalElement & IIndexedHeaderElement & IIndexedRowElement & INamedElement & ITypedElement & IEditableElement>;
type GenericStyle = Style & Partial<{ if: GenericIf }>;

function convertElement(style: GenericStyle): IConvertedStyle {
    const indexFilter = style.if && (style.if.header_index || style.if.row_index);
    let ast: QuerySyntaxTree;

    return {
        checksColumn: () => !R.isNil(style.if) && (
            !R.isNil(style.if.column_id) ||
            !R.isNil(style.if.column_type) ||
            !R.isNil(style.if.column_editable)
        ),
        checksFilter: () => !R.isNil(style.if) && !R.isNil(style.if.filter_query),
        checksRow: () => !R.isNil(indexFilter),
        checksState: () => !R.isNil(style.if?.state),
        checksStateActive: () => style.if?.state === 'active',
        checksStateSelected: () => style.if?.state === 'selected',
        matchesActive: (active: boolean) => ifColumnStateActive(style.if, active),
        matchesColumn: (column: IColumn | undefined) =>
            !style.if || (
                !R.isNil(column) &&
                ifColumnId(style.if, column && column.id) &&
                ifColumnType(style.if, column && column.type) &&
                ifEditable (style.if, column && column.editable)
            ),
        matchesFilter: (datum: Datum) =>
            !style.if ||
            style.if.filter_query === undefined ||
            (ast = ast || new QuerySyntaxTree(style.if.filter_query)).evaluate(datum),
        matchesRow: (index: number | undefined) =>
            indexFilter === undefined ?
                true :
                typeof indexFilter === 'number' ?
                    index === indexFilter :
                    !R.isNil(index) && (indexFilter === 'odd' ? index % 2 === 1 : index % 2 === 0),
        matchesSelected: (selected: boolean) => ifColumnStateSelected(style.if, selected),
        style: convertStyle(style)
    };
}

function convertStyle(style: Style): CSSProperties {
    return R.reduce<[string, StyleProperty?], any>((res, [key, value]) => {
        if (converter.has(key)) {
            res[converter.get(key) as string] = value;
        }
        return res;
    }, {}, R.toPairs(style));
}

export const derivedRelevantCellStyles = memoizeOneFactory((
    cell: Style,
    dataCell: Style,
    cells: Cells,
    dataCells: DataCells
) => R.unnest([
    cell ? [convertElement(cell)] : [],
    R.map(convertElement, cells || []),
    dataCell ? [convertElement(dataCell)] : [],
    R.map(convertElement, dataCells || [])
]));

export const derivedRelevantFilterStyles = memoizeOneFactory((
    cell: Style,
    filter: Style,
    cells: Cells,
    filters: BasicFilters
) => R.unnest([
    cell ? [convertElement(cell)] : [],
    R.map(convertElement, cells || []),
    filter ? [convertElement(filter)] : [],
    R.map(convertElement, filters || [])
]));

export const derivedRelevantHeaderStyles = memoizeOneFactory((
    cell: Style,
    header: Style,
    cells: Cells,
    headers: Headers
) => R.unnest([
    cell ? [convertElement(cell)] : [],
    R.map(convertElement, cells || []),
    header ? [convertElement(header)] : [],
    R.map(convertElement, headers || [])
]));

export const derivedTableStyle = memoizeOneFactory(
    (defaultTable: Table, table: Table) => [
        convertStyle(defaultTable),
        convertStyle(table)
    ]
);

export function resolveStyle(styles: IConvertedStyle[]): CSSProperties {
    let res: CSSProperties = {};

    for (let i = 0; i < styles.length; ++i) {
        Object.assign(res, styles[i].style);
    }

    return R.omit(BORDER_PROPERTIES_AND_FRAGMENTS, res);
}

export const getDataCellStyle = (datum: Datum, i: number, column: IColumn, active: boolean, selected: boolean) => (styles: IConvertedStyle[]) => resolveStyle(matchesDataCell(datum, i, column, active, selected)(styles));
export const getDataOpCellStyle = (datum: Datum, i: number) => (styles: IConvertedStyle[]) => resolveStyle(matchesDataOpCell(datum, i)(styles));
export const getFilterCellStyle = (column: IColumn) => (styles: IConvertedStyle[]) => resolveStyle(matchesFilterCell(column)(styles));
export const getFilterOpCellStyle = () => (styles: IConvertedStyle[]) => resolveStyle(getFilterOpStyles(styles));
export const getHeaderCellStyle = (i: number, column: IColumn) => (styles: IConvertedStyle[]) => resolveStyle(matchesHeaderCell(i, column)(styles));
export const getHeaderOpCellStyle = (i: number) => (styles: IConvertedStyle[]) => resolveStyle(getHeaderOpStyles(i)(styles));
