import * as R from 'ramda';
import React, { CSSProperties } from 'react';

import { memoizeOneFactory } from 'core/memoizer';
import { Dataframe, IVisibleColumn, VisibleColumns, ColumnType, ActiveCell, SelectedCells, Datum, ColumnId } from 'dash-table/components/Table/props';
import { IConditionalStyle, IStyle } from 'dash-table/components/Cell/types';
import Cell from 'dash-table/components/Cell';
import SyntaxTree from 'core/syntax-tree';
import memoizerCache from 'core/memoizerCache';

const styleAstCache = memoizerCache<[string, ColumnId, number], [string], SyntaxTree>(
    (query: string) => new SyntaxTree(query)
);

const getClasses = (
    active: boolean,
    classes: string[],
    editable: boolean,
    selected: boolean,
    type: ColumnType | undefined
) => [
    'dash-cell',
    ...(active ? ['focused'] : []),
    ...(!editable ? ['cell--uneditable'] : []),
    ...(selected ? ['cell--selected'] : []),
    ...(type === ColumnType.Dropdown ? ['dropdown'] : []),
    ...classes
].join(' ');

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

const getter = (
    activeCell: ActiveCell,
    columns: VisibleColumns,
    columnConditionalStyle: any,
    columnStaticStyle: any,
    dataframe: Dataframe,
    editable: boolean,
    id: string,
    selectedCells: SelectedCells
): JSX.Element[][] => R.addIndex<Datum, JSX.Element[]>(R.map)(
    (datum, rowIndex) => R.addIndex<IVisibleColumn, JSX.Element>(R.map)(
        (column, columnIndex) => {
            let conditionalStyles = columnConditionalStyle.find((cs: any) => cs.id === column.id);
            let staticStyle = columnStaticStyle.find((ss: any) => ss.id === column.id);

            conditionalStyles = (conditionalStyles && conditionalStyles.styles) || [];
            staticStyle = staticStyle && staticStyle.style;

            const active = activeCell[0] === rowIndex && activeCell[1] === columnIndex;
            const selected = R.contains([rowIndex, columnIndex], selectedCells);

            const classes = getClasses(active, [`column-${columnIndex}`], editable, selected, column.type);
            const style = getStyle(conditionalStyles, datum[column.id], column.id, staticStyle, id);

            return (<Cell
                active={active}
                classes={classes}
                key={`column-${columnIndex}`}
                property={column.id}
                style={style}
            />);
        },
        columns
    ),
    dataframe
);

export default memoizeOneFactory(getter);
