import * as R from 'ramda';
import { CSSProperties } from 'react';

import { memoizeOneFactory } from 'core/memoizer';
import { Dataframe, IVisibleColumn, VisibleColumns, Datum, ColumnId } from 'dash-table/components/Table/props';
import { IConditionalStyle, IStyle } from 'dash-table/components/Cell/types';
import SyntaxTree from 'core/syntax-tree';
import memoizerCache from 'core/memoizerCache';

const styleAstCache = memoizerCache<[string, ColumnId, number], [string], SyntaxTree>(
    (query: string) => new SyntaxTree(query)
);

const getStyle = (
    conditionalStyles: IConditionalStyle[],
    datum: Datum,
    property: ColumnId,
    staticStyle: IStyle,
    tableId: string
) => {
    const styles = [
        staticStyle,
        ...R.map(
            ([cs]) => cs.style,
            R.filter(
                ([cs, i]) => styleAstCache([tableId, property, i], cs.condition).evaluate(datum),
                R.addIndex<IConditionalStyle, [IConditionalStyle, number]>(R.map)(
                    (cs, i) => [cs, i],
                    conditionalStyles
                )
            )
        )
    ];

    return styles.length ? R.mergeAll<CSSProperties>(styles) : undefined;
};

type Style = CSSProperties | undefined;

const datumGetter = (
    columnConditionalStyle: any,
    columnStaticStyle: any,
    id: string,
    datum: Datum,
    column: IVisibleColumn
): Style => {
    let conditionalStyles = columnConditionalStyle.find((cs: any) => cs.id === column.id);
    let staticStyle = columnStaticStyle.find((ss: any) => ss.id === column.id);

    conditionalStyles = (conditionalStyles && conditionalStyles.styles) || [];
    staticStyle = staticStyle && staticStyle.style;

    return getStyle(conditionalStyles, datum[column.id], column.id, staticStyle, id);
};

const getter = (
    columns: VisibleColumns,
    columnConditionalStyle: any,
    columnStaticStyle: any,
    dataframe: Dataframe,
    id: string
): Style[][] => {
    const bindedDatumGetter = datumGetter.bind(undefined, columnConditionalStyle, columnStaticStyle, id);

    return R.map(datum => R.map(column => bindedDatumGetter(datum, column), columns), dataframe);
};

export default memoizeOneFactory(getter);
