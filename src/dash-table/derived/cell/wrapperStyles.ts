import * as R from 'ramda';
import { CSSProperties } from 'react';

import { memoizeOneFactory } from 'core/memoizer';
import { ColumnId, Dataframe, Datum, VisibleColumns } from 'dash-table/components/Table/props';
import SyntaxTree from 'core/syntax-tree';
import memoizerCache from 'core/memoizerCache';

interface IStyle {
    target?: undefined;
    style: CSSProperties;
}

interface IConditionalStyle extends IStyle {
    condition: string;
}

type Style = CSSProperties | undefined;

const getStyle = (
    astCache: (key: [ColumnId, number], query: string) => SyntaxTree,
    conditionalStyles: IConditionalStyle[],
    datum: Datum,
    property: ColumnId,
    staticStyle: IStyle
) => {
    const styles = [
        staticStyle,
        ...R.map(
            ([cs]) => cs.style,
            R.filter(
                ([cs, i]) => astCache([property, i], cs.condition).evaluate(datum),
                R.addIndex<IConditionalStyle, [IConditionalStyle, number]>(R.map)(
                    (cs, i) => [cs, i],
                    conditionalStyles
                )
            )
        )
    ];

    return styles.length ? R.mergeAll<CSSProperties>(styles) : undefined;
};

const NULL_CONDITIONAL_STYLES: IConditionalStyle[] = [];

const getter = (
    astCache: (key: [ColumnId, number], query: string) => SyntaxTree,
    styleCache: (
        key: [ColumnId, number],
        astCache: (key: [ColumnId, number], query: string) => SyntaxTree,
        conditionalStyles: IConditionalStyle[],
        datum: Datum,
        property: ColumnId,
        staticStyle: IStyle
    ) => Style,
    columns: VisibleColumns,
    columnConditionalStyle: any,
    columnStaticStyle: any,
    dataframe: Dataframe
): Style[][] => R.addIndex<any, any>(R.map)((datum, rowIndex) => R.addIndex<any, any>(R.map)((column, columnIndex) => {
    let conditionalStyles = columnConditionalStyle.find((cs: any) => cs.id === column.id);
    let staticStyle = columnStaticStyle.find((ss: any) => ss.id === column.id);

    conditionalStyles = (conditionalStyles && conditionalStyles.styles) || NULL_CONDITIONAL_STYLES;
    staticStyle = staticStyle && staticStyle.style;

    return styleCache(
        [rowIndex, columnIndex],
        astCache,
        conditionalStyles,
        datum[column.id],
        column.id,
        staticStyle
    );
}, columns), dataframe);

const getterFactory = memoizeOneFactory(getter);

const decoratedGetter = (_id: string): ((
    columns: VisibleColumns,
    columnConditionalStyle: any,
    columnStaticStyle: any,
    dataframe: Dataframe
) => Style[][]) => {
    const astCache = memoizerCache<[ColumnId, number], [string], SyntaxTree>(
        (query: string) => new SyntaxTree(query)
    );

    const styleCache = memoizerCache<
        [ColumnId, number],
        [(key: [ColumnId, number], query: string) => SyntaxTree, IConditionalStyle[], Datum, ColumnId, IStyle],
        Style
        >(getStyle);

    return getterFactory().bind(undefined, astCache, styleCache);
};

export default memoizeOneFactory(decoratedGetter);
