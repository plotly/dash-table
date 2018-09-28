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

const getter = (
    astCache: (key: [ColumnId, number], query: string) => SyntaxTree,
    columns: VisibleColumns,
    columnConditionalStyle: any,
    columnStaticStyle: any,
    dataframe: Dataframe
): Style[][] => R.map(datum => R.map(column => {
    let conditionalStyles = columnConditionalStyle.find((cs: any) => cs.id === column.id);
    let staticStyle = columnStaticStyle.find((ss: any) => ss.id === column.id);

    conditionalStyles = (conditionalStyles && conditionalStyles.styles) || [];
    staticStyle = staticStyle && staticStyle.style;

    return getStyle(
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

    return getterFactory().bind(undefined, astCache);
};

export default memoizeOneFactory(decoratedGetter);
