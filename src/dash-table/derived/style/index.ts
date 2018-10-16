import * as R from 'ramda';
import { CSSProperties } from 'react';

import SyntaxTree from 'core/syntax-tree';
import { memoizeOneFactory } from 'core/memoizer';

import { ColumnId } from 'dash-table/components/Table/props';

import TableStyle, { Style, IConditionalElement } from './props';
import converter, { StyleProperty } from './py2jsCssProperties';

export interface IConvertedStyle {
    style: CSSProperties;
    id?: ColumnId;
    condition?: SyntaxTree;
}

function convertElement(style: Style & IConditionalElement) {
    return {
        id: style.id,
        condition: style.condition === undefined ?
            undefined :
            new SyntaxTree(style.condition),
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

export const derivedColumnStyles = memoizeOneFactory(
    (style: TableStyle) => R.map(convertElement, style.columns || [])
);

export const derivedHeaderStyles = memoizeOneFactory(
    (style: TableStyle) => R.map(convertElement, style.headers || [])
);

export const derivedRowStyles = memoizeOneFactory(
    (style: TableStyle) => R.map(convertElement, style.rows || [])
);

export const derivedTableStyle = memoizeOneFactory(
    (style: TableStyle) => convertStyle(style)
);