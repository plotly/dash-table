import * as R from 'ramda';
import React from 'react';

import { memoizeOneFactory } from 'core/memoizer';

import {
    ActiveCell,
    Data,
    Datum,
    IVisibleColumn,
    VisibleColumns,
    ICellFactoryProps,
    IViewportOffset,
    ColumnType
} from 'dash-table/components/Table/props';
import CellContent from 'dash-table/components/CellContent';
import derivedCellEventHandlerProps from 'dash-table/derived/cell/eventHandlerProps';
import isActiveCell from 'dash-table/derived/cell/isActive';
import isCellEditable from './isEditable';
import CellLabel from 'dash-table/components/CellLabel';

const mapData = R.addIndex<Datum, JSX.Element[]>(R.map);
const mapRow = R.addIndex<IVisibleColumn, JSX.Element>(R.map);

const cellEventHandlerProps = derivedCellEventHandlerProps();

function isCellLabel(
    active: boolean,
    editable: boolean,
    dropdown: any,
    type: ColumnType = ColumnType.Text
) {
    switch (type) {
        case ColumnType.Text:
        case ColumnType.Numeric:
            return !active && !editable;
        case ColumnType.Dropdown:
            return !dropdown && !editable;
        default:
            return true;
    }
}

const getter = (
    activeCell: ActiveCell,
    columns: VisibleColumns,
    data: Data,
    offset: IViewportOffset,
    editable: boolean,
    isFocused: boolean,
    tableId: string,
    dropdowns: any[][],
    propsFn: () => ICellFactoryProps
): JSX.Element[][] => mapData(
    (datum, rowIndex) => mapRow(
        (column, columnIndex) => {
            const active = isActiveCell(activeCell, rowIndex + offset.rows, columnIndex + offset.columns);

            const dropdown = dropdowns[rowIndex][columnIndex];
            const handlers = cellEventHandlerProps(propsFn)(rowIndex, columnIndex);

            const isEditable = isCellEditable(editable, column.editable);
            const isLabel = isCellLabel(active, isEditable, dropdown, column.type);

            return isLabel ?
                (<CellLabel
                    className={[
                        ...(active ? ['input-active'] : []),
                        ...(isFocused ? ['focused'] : ['unfocused']),
                        ...['dash-cell-value']
                    ].join(' ')}
                    key={`column-${columnIndex}`}
                    onClick={handlers.onClick}
                    onDoubleClick={handlers.onDoubleClick}
                    value={datum[column.id]}
                />) :
                (<CellContent
                    key={`column-${columnIndex}`}
                    active={active}
                    clearable={column.clearable}
                    datum={datum}
                    dropdown={dropdown}
                    editable={isEditable}
                    focused={isFocused}
                    property={column.id}
                    tableId={tableId}
                    type={column.type}
                    value={datum[column.id]}
                    {...handlers}
                />);
        },
        columns
    ),
    data
);

export default memoizeOneFactory(getter);
