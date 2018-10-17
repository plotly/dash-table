import * as R from 'ramda';
import { CSSProperties } from 'react';

import SyntaxTree from 'core/syntax-tree';
import { memoizeOneFactory } from 'core/memoizer';

import { ColumnId } from 'dash-table/components/Table/props';

import { Style, IConditionalElement, INamedElement, CellsAndHeaders, Cells, Headers, Table, IIndexedHeaderElement, IIndexedRowElement } from './props';
import converter, { StyleProperty } from './py2jsCssProperties';

export interface IConvertedStyle {
    style: CSSProperties;
    id?: ColumnId;
    idx?: (idx: number) => boolean;
    filter?: SyntaxTree;
}

type GenericIf = Partial<IConditionalElement & IIndexedHeaderElement & IIndexedRowElement & INamedElement>;
type GenericStyle = Style & { if: GenericIf };

function convertElement(style: GenericStyle) {
    const indexFilter = style.if && (style.if.header_index || style.if.row_index);

    return {
        id: style.if && style.if.column_id,
        idx: indexFilter === undefined ?
            undefined :
            typeof indexFilter === 'number' ?
                (i: number) => i === indexFilter :
                (i: number) => indexFilter === 'odd' ? i % 2 === 1 : i % 2 === 0,
        filter: style.if && style.if.filter !== undefined ?
            new SyntaxTree(style.if.filter) :
            undefined,
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

export const derivedRelevantCellStyles = memoizeOneFactory(
    (cellsAndHeaders: CellsAndHeaders, cells: Cells) => R.concat(
        R.map(convertElement, cellsAndHeaders || []),
        R.map(convertElement, cells || [])
    )
);

export const derivedRelevantHeaderStyles = memoizeOneFactory(
    (cellsAndHeaders: CellsAndHeaders, headers: Headers) => R.concat(
        R.map(convertElement, cellsAndHeaders || []),
        R.map(convertElement, headers || [])
    )
);

export const derivedTableStyle = memoizeOneFactory(
    (table: Table) => convertStyle(table || {})
);