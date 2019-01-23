import * as R from 'ramda';
import React, { MouseEvent } from 'react';

import { memoizeAll, memoizeOne } from 'core/memoizer';
import memoizerCache from 'core/memoizerCache';

import { Data, IVisibleColumn, VisibleColumns, ActiveCell, SelectedCells, Datum, ColumnId, IViewportOffset, Presentation, ICellFactoryProps } from 'dash-table/components/Table/props';
import Cell from 'dash-table/components/Cell';

import derivedCellEventHandlerProps from 'dash-table/derived/cell/eventHandlerProps';
import isActiveCell from 'dash-table/derived/cell/isActive';
import isSelectedCell from 'dash-table/derived/cell/isSelected';

const cellEventHandlerProps = derivedCellEventHandlerProps();

type Key = [number, number];
type ElementCacheFn = (
    key: Key,
    active: boolean,
    classes: string,
    columnIndex: number,
    rowIndex: number,
    columnId: ColumnId,
    onEnter: (e: MouseEvent) => void,
    onLeave: (e: MouseEvent) => void
) => JSX.Element;

function getter(
    elementCache: ElementCacheFn,
    activeCell: ActiveCell,
    columns: VisibleColumns,
    data: Data,
    offset: IViewportOffset,
    selectedCells: SelectedCells,
    propsFn: () => ICellFactoryProps
): JSX.Element[][] {
    return R.addIndex<Datum, JSX.Element[]>(R.map)(
        (_, rowIndex) => R.addIndex<IVisibleColumn, JSX.Element>(R.map)(
            (column, columnIndex) => {
                const active = isActiveCell(activeCell, rowIndex + offset.rows, columnIndex + offset.columns);
                const selected = isSelectedCell(selectedCells, rowIndex + offset.rows, columnIndex + offset.columns);

                const isDropdown = column.presentation === Presentation.Dropdown;

                const handlers = cellEventHandlerProps(propsFn)(rowIndex, columnIndex);

                const classes =
                    'dash-cell' +
                    ` column-${columnIndex}` +
                    (active ? ' focused' : '') +
                    (selected ? ' cell--selected' : '') +
                    (isDropdown  ? ' dropdown' : '');

                return elementCache([rowIndex, columnIndex], active, classes, columnIndex, rowIndex, column.id, handlers.onEnter, handlers.onLeave);
            },
            columns
        ),
        data
    );
}

function decorator(_id: string): ((
    activeCell: ActiveCell,
    columns: VisibleColumns,
    data: Data,
    offset: IViewportOffset,
    selectedCells: SelectedCells,
    propsFn: () => ICellFactoryProps
) => JSX.Element[][]) {
    const elementCache = memoizerCache<Key, [boolean, string, number, number, ColumnId, (e: MouseEvent) => void, (e: MouseEvent) => void], JSX.Element>(
        (
            active: boolean,
            classes: string,
            columnIndex: number,
            rowIndex: number,
            columnId: ColumnId,
            onEnter: (e: MouseEvent) => void,
            onLeave: (e: MouseEvent) => void
        ) => (<Cell
            active={active}
            classes={classes}
            key={`column-${columnIndex}`}
            attributes={{
                'data-dash-column': columnId,
                'data-dash-row': rowIndex
            }}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
        />)
    );

    return memoizeOne(getter).bind(undefined, elementCache);
}

export default memoizeAll(decorator);
