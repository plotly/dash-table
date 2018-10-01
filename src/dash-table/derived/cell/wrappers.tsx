import * as R from 'ramda';
import React from 'react';

import { memoizeOneFactory } from 'core/memoizer';
import { Dataframe, IVisibleColumn, VisibleColumns, ColumnType, ActiveCell, SelectedCells, Datum, ColumnId } from 'dash-table/components/Table/props';
import Cell from 'dash-table/components/Cell';
import isActiveCell from 'dash-table/derived/cell/isActive';
import isSelectedCell from 'dash-table/derived/cell/isSelected';
import memoizerCache from 'core/memoizerCache';

const getter = (
    elementCache: (key: [number, number], active: boolean, classes: string, columnIndex: number, columnId: ColumnId) => JSX.Element,
    activeCell: ActiveCell,
    isFocused: boolean,
    columns: VisibleColumns,
    dataframe: Dataframe,
    editable: boolean,
    selectedCells: SelectedCells
): JSX.Element[][] => R.addIndex<Datum, JSX.Element[]>(R.map)(
    (_, rowIndex) => R.addIndex<IVisibleColumn, JSX.Element>(R.map)(
        (column, columnIndex) => {
            const active = isActiveCell(activeCell, rowIndex, columnIndex);
            const selected = isSelectedCell(selectedCells, rowIndex, columnIndex);

            const classes =
                'dash-cell' +
                ` column-${columnIndex}` +
                (active ? ' focused' : '') +
                (isFocused ? ' input-focused' : '') +
                (!editable ? ' cell--uneditable' : '') +
                (selected ? ' cell--selected' : '') +
                (column.type === ColumnType.Dropdown ? ' dropdown' : '');

            return elementCache([rowIndex, columnIndex], active, classes, columnIndex, column.id);
        },
        columns
    ),
    dataframe
);

const getterFactory = memoizeOneFactory(getter);

const decoratedGetter = (_id: string): ((
    activeCell: ActiveCell,
    isFocused: boolean,
    columns: VisibleColumns,
    columnConditionalStyle: any,
    columnStaticStyle: any,
    dataframe: Dataframe
) => JSX.Element[][]) => {
    const elementCache = memoizerCache<[number, number], [boolean, string, number, ColumnId], JSX.Element>(
        (active: boolean, classes: string, columnIndex: number, columnId: ColumnId) => (<Cell
            active={active}
            classes={classes}
            key={`column-${columnIndex}`}
            property={columnId}
        />)
    );

    return getterFactory().bind(undefined, elementCache);
};

export default memoizeOneFactory(decoratedGetter);
