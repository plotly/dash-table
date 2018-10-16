import * as R from 'ramda';
import { CSSProperties } from 'react';

import TableStyle, { Element, Selector, Style } from './props';
import converter, { StyleProperty } from './py2jsCssProperties';
import SyntaxTree from 'core/syntax-tree';
import { memoizeOneFactory } from 'core/memoizer';

export interface IConvertedStyle {
    style: CSSProperties;
    id?: string;
    condition?: SyntaxTree;
    // focus?: CSSProperties;
    // hover?: CSSProperties;
}

function convertStyle(style: Style): CSSProperties {
    return R.reduce<[string, StyleProperty?], any>((res, [key, value]) => {
        if (converter.has(key)) {
            res[converter.get(key) as string] = value;
        }
        return res;
    }, {}, R.toPairs(style));
}

function convertElementStyle(style: Element): IConvertedStyle {
    return {
        style: convertStyle(style) // ,
        // focus: style.focus && convertStyle(style.focus),
        // hover: style.hover && convertStyle(style.hover)
    };
}

function convertConditionalElementStyle(style: Element & Selector): IConvertedStyle {
    return {
        id: style.id,
        condition: style.condition ?
            new SyntaxTree(style.condition) :
            undefined,
        style: convertStyle(style) // ,
        // focus: style.focus && convertStyle(style.focus),
        // hover: style.hover && convertStyle(style.hover)
    };
}

export const derivedColumnStyles = memoizeOneFactory(
    (style: TableStyle) => style.columns ?
        R.map(convertConditionalElementStyle, style.columns) :
        []
);

export const derivedHeaderStyles = memoizeOneFactory(
    (style: TableStyle) => style.headers ?
        R.map(convertConditionalElementStyle, style.headers) :
        []
);

export const derivedRowStyles = memoizeOneFactory(
    (style: TableStyle) => style.rows ?
        R.map(convertConditionalElementStyle, style.rows) :
        []
);

export const derivedTableStyle = memoizeOneFactory(
    (style: TableStyle) => convertElementStyle(style)
);