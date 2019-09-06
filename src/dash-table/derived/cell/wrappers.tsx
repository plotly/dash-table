import * as R from 'ramda';
import React, { MouseEvent } from 'react';

import { memoizeOne } from 'core/memoizer';
import memoizerCache from 'core/cache/memoizer';
import { Data, IColumn, Columns, ICellCoordinates, SelectedCells, Datum, ColumnId, IViewportOffset, Presentation, ICellFactoryProps } from 'dash-table/components/Table/props';
import Cell from 'dash-table/components/Cell';
import derivedCellEventHandlerProps, { Handler } from 'dash-table/derived/cell/eventHandlerProps';
import isActiveCell from 'dash-table/derived/cell/isActive';
import { shallowClone } from 'core/math/matrixZipMap';

export default (propsFn: () => ICellFactoryProps) => new Wrappers(propsFn);

class Wrappers {
    constructor(
        propsFn: () => ICellFactoryProps,
        private readonly handlers = derivedCellEventHandlerProps(propsFn)
    ) {

    }

    partialGet = memoizeOne((
        columns: Columns,
        data: Data,
        offset: IViewportOffset
    ) => R.addIndex<Datum, JSX.Element[]>(R.map)(
        (_, rowIndex) => R.addIndex<IColumn, JSX.Element>(R.map)(
            (column, columnIndex) => this.getWrapper(
                false,
                false,
                rowIndex + offset.rows,
                columnIndex,
                column
            ), columns), data));

    /**
     * Returns the wrapper for each cell in the table.
     */
    get = memoizeOne((
        wrappers: JSX.Element[][],
        offset: IViewportOffset,
        activeCell: ICellCoordinates | undefined,
        selectedCells: SelectedCells
    ) => {
        wrappers = shallowClone(wrappers);

        R.forEach(({ row: i, column: j }) => {
            i -= offset.rows;
            j -= offset.columns;

            if (i < 0 || j < 0 || wrappers.length <= i || wrappers[i].length <= j) {
                return;
            }

            const w = wrappers[i][j];
            const active = isActiveCell(activeCell, i + offset.rows, j + offset.columns);

            wrappers[i][j] = React.cloneElement(w, {
                classes: w.props.classes + ' cell--selected' + (active ? ' focused' : '')
            });

        }, selectedCells);

        return wrappers;
    });

    private getWrapper(
        active: boolean,
        selected: boolean,
        rowIndex: number,
        columnIndex: number,
        column: IColumn
    ) {
        const isDropdown = column.presentation === Presentation.Dropdown;
        const classes = 'dash-cell' +
            ` column-${columnIndex}` +
            (active ? ' focused' : '') +
            (selected ? ' cell--selected' : '') +
            (isDropdown ? ' dropdown' : '');

        return this.wrapper.get(rowIndex, columnIndex)(
            active,
            classes,
            columnIndex,
            column.id,
            rowIndex,
            this.handlers(Handler.Enter, rowIndex, columnIndex),
            this.handlers(Handler.Leave, rowIndex, columnIndex),
            this.handlers(Handler.Move, rowIndex, columnIndex),
            this.handlers(Handler.Click, rowIndex, columnIndex),
            this.handlers(Handler.DoubleClick, rowIndex, columnIndex)
        );
    }

    /**
     * Returns the wrapper for a cell.
     */
    private wrapper = memoizerCache<[number, number]>()((
        active: boolean,
        classes: string,
        columnIndex: number,
        columnId: ColumnId,
        rowIndex: number,
        onEnter: (e: MouseEvent) => void,
        onLeave: (e: MouseEvent) => void,
        onMove: (e: MouseEvent) => void,
        onClick: (e: MouseEvent) => void,
        onDoubleClick: (e: MouseEvent) => void
    ) => (<Cell
        active={active}
        attributes={{
            'data-dash-column': columnId,
            'data-dash-row': rowIndex
        }}
        classes={classes}
        key={`column-${columnIndex}`}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onMouseMove={onMove}
    />));
}
