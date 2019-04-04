import * as R from 'ramda';
import { CSSProperties } from 'react';

import SyntaxTree from 'core/syntax-tree';
import { memoizeOneFactory } from 'core/memoizer';

import { Datum, IVisibleColumn } from 'dash-table/components/Table/props';

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
    ifColumnId,
    ifColumnType
 } from 'dash-table/conditional';

export interface IConvertedStyle {
    style: CSSProperties;
    matchesColumn: (column: IVisibleColumn) => boolean;
    matchesRow: (index: number) => boolean;
    matchesFilter: (datum: Datum) => boolean;
}

type GenericIf = Partial<IConditionalElement & IIndexedHeaderElement & IIndexedRowElement & INamedElement & ITypedElement>;
type GenericStyle = Style & Partial<{ if: GenericIf }>;

function convertElement(style: GenericStyle, index: number) {
    const indexFilter = style.if && (style.if.header_index || style.if.row_index);
    let ast: SyntaxTree;

    return {
        matchesColumn: (column: IVisibleColumn) =>
            !style.if || (
                ifColumnId(style.if, column.id) &&
                ifColumnType(style.if, column.type)
            ),
        matchesRow: (index: number) =>
            indexFilter === undefined ?
                true :
                typeof indexFilter === 'number' ?
                    index === indexFilter :
                    indexFilter === 'odd' ? index % 2 === 1 : index % 2 === 0,
        matchesFilter: (datum: Datum) =>
            !style.if ||
            style.if.filter === undefined ||
            (ast = ast || new SyntaxTree(style.if.filter)).evaluate(datum),
        style: convertStyle(style),
        index: index
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
) => R.concat(
    R.concat(
        cell ? [convertElement(cell, 0)] : [],
        R.addIndex(R.map)(convertElement, cells || []) as IConvertedStyle[]
    ),
    R.concat(
        dataCell ? [convertElement(dataCell, 0)] : [],
        R.addIndex(R.map)(convertElement, dataCells || []) as IConvertedStyle[]
    )
));

export const derivedRelevantFilterStyles = memoizeOneFactory((
    cell: Style,
    filter: Style,
    cells: Cells,
    filters: BasicFilters
) => R.concat(
    R.concat(
        cell ? [convertElement(cell, 0)] : [],
        R.addIndex(R.map)(convertElement, cells || []) as IConvertedStyle[]
    ),
    R.concat(
        filter ? [convertElement(filter, 0)] : [],
        R.addIndex(R.map)(convertElement, filters || []) as IConvertedStyle[]
    )
));

export const derivedRelevantHeaderStyles = memoizeOneFactory((
    cell: Style,
    header: Style,
    cells: Cells,
    headers: Headers
) => R.concat(
    R.concat(
        cell ? [convertElement(cell, 0)] : [],
        R.addIndex(R.map)(convertElement, cells || []) as IConvertedStyle[]
    ),
    R.concat(
        header ? [convertElement(header, 0)] : [],
        R.addIndex(R.map)(convertElement, headers || []) as IConvertedStyle[]
    )
));

export const derivedTableStyle = memoizeOneFactory(
    (defaultTable: Table, table: Table) => [
        convertStyle(defaultTable),
        convertStyle(table)
    ]
);
