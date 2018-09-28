import * as R from 'ramda';
import React from 'react';

import { memoizeOneFactory } from 'core/memoizer';
import { Dataframe, IVisibleColumn, VisibleColumns, ColumnType, ActiveCell, SelectedCells, Datum } from 'dash-table/components/Table/props';
import Cell from 'dash-table/components/Cell';
import isActiveCell from 'dash-table/derived/cell/isActive';
import isSelectedCell from 'dash-table/derived/cell/isSelected';

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

const getter = (
    activeCell: ActiveCell,
    columns: VisibleColumns,
    dataframe: Dataframe,
    editable: boolean,
    selectedCells: SelectedCells
): JSX.Element[][] => R.addIndex<Datum, JSX.Element[]>(R.map)(
    (_, rowIndex) => R.addIndex<IVisibleColumn, JSX.Element>(R.map)(
        (column, columnIndex) => {
            const active = isActiveCell(activeCell, rowIndex, columnIndex);
            const selected = isSelectedCell(selectedCells, rowIndex, columnIndex);

            const classes = getClasses(active, [`column-${columnIndex}`], editable, selected, column.type);

            return (<Cell
                active={active}
                classes={classes}
                key={`column-${columnIndex}`}
                property={column.id}
            />);
        },
        columns
    ),
    dataframe
);

export default memoizeOneFactory(getter);
