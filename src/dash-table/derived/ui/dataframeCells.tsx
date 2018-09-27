import * as R from 'ramda';
import React, { CSSProperties } from 'react';

import { memoizeOneFactory } from 'core/memoizer';
import { Dataframe, IVisibleColumn, VisibleColumns, ColumnType, ActiveCell, SelectedCells, Datum, ColumnId } from 'dash-table/components/Table/props';
import isActiveCell from 'dash-table/derived/ui/isActiveCell';
import isSelectedCell from 'dash-table/derived/ui/isSelectedCell';
import { IConditionalStyle, IStyle } from 'dash-table/components/Cell/types';
import Cell from 'dash-table/components/Cell';

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
                ([cs, i]) => Cell.styleAstCache([tableId, property, i], cs.condition).evaluate(datum),
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

            conditionalStyles = conditionalStyles && conditionalStyles.styles;
            staticStyle = staticStyle && staticStyle.style;

            return (<td
                className={getClasses(
                    isActiveCell(activeCell, rowIndex, columnIndex),
                    [`column-${columnIndex}`],
                    editable,
                    isSelectedCell(selectedCells, rowIndex, columnIndex),
                    column.type
                )}
                data-dash-column={column.id}
                style={getStyle(
                    conditionalStyles || [],
                    datum,
                    column.id,
                    staticStyle || {},
                    id
                )}
            />);
        },
        columns
    ),
    dataframe
);

export default memoizeOneFactory(getter);
