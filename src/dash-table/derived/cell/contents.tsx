import * as R from 'ramda';
import React from 'react';

import {
    ActiveCell,
    Data,
    Datum,
    DropdownValues,
    ICellFactoryProps,
    IViewportOffset,
    IVisibleColumn,
    Presentation,
    VisibleColumns
} from 'dash-table/components/Table/props';
import CellInput from 'dash-table/components/CellInput';
import derivedCellEventHandlerProps, { Handler } from 'dash-table/derived/cell/eventHandlerProps';
import isActiveCell from 'dash-table/derived/cell/isActive';
import isCellEditable from './isEditable';
import CellLabel from 'dash-table/components/CellLabel';
import CellDropdown from 'dash-table/components/CellDropdown';
import { memoizeOne } from 'core/memoizer';
import getFormatter from 'dash-table/type/formatter';

const mapData = R.addIndex<Datum, JSX.Element[]>(R.map);
const mapRow = R.addIndex<IVisibleColumn, JSX.Element>(R.map);

enum CellType {
    Dropdown,
    Input,
    Label
}

function getCellType(
    active: boolean,
    editable: boolean,
    dropdown: DropdownValues | undefined,
    presentation: Presentation | undefined
): CellType {
    switch (presentation) {
        case Presentation.Input:
            return (!active || !editable) ? CellType.Label : CellType.Input;
        case Presentation.Dropdown:
            return (!dropdown || !editable) ? CellType.Label : CellType.Dropdown;
        default:
            return (!active || !editable) ? CellType.Label : CellType.Input;
    }
}

export default (propsFn: () => ICellFactoryProps) => new Contents(propsFn).get;

class Contents {
    constructor(
        propsFn: () => ICellFactoryProps,
        private readonly handlers = derivedCellEventHandlerProps(propsFn)
    ) {

    }

    get = memoizeOne((
        activeCell: ActiveCell,
        columns: VisibleColumns,
        data: Data,
        offset: IViewportOffset,
        editable: boolean,
        isFocused: boolean,
        dropdowns: (DropdownValues | undefined)[][]
    ): JSX.Element[][] => {
        const formatters = R.map(getFormatter, columns);

        return mapData(
            (datum, rowIndex) => mapRow(
                (column, columnIndex) => {
                    const active = isActiveCell(activeCell, rowIndex + offset.rows, columnIndex + offset.columns);

                    const dropdown = dropdowns[rowIndex][columnIndex];

                    const isEditable = isCellEditable(editable, column.editable);

                    const className = [
                        ...(active ? ['input-active'] : []),
                        isFocused ? 'focused' : 'unfocused',
                        'dash-cell-value'
                    ].join(' ');

                    switch (getCellType(active, isEditable, dropdown, column.presentation)) {
                        case CellType.Dropdown:
                            return (<CellDropdown
                                key={`column-${columnIndex}`}
                                active={active}
                                clearable={column.clearable}
                                dropdown={dropdown}
                                onChange={this.handlers(Handler.Change, rowIndex, columnIndex)}
                                value={datum[column.id]}
                            />);
                        case CellType.Input:
                            return (<CellInput
                                key={`column-${columnIndex}`}
                                active={active}
                                className={className}
                                focused={isFocused}
                                onChange={this.handlers(Handler.Change, rowIndex, columnIndex)}
                                onClick={this.handlers(Handler.Click, rowIndex, columnIndex)}
                                onDoubleClick={this.handlers(Handler.DoubleClick, rowIndex, columnIndex)}
                                onMouseUp={this.handlers(Handler.MouseUp, rowIndex, columnIndex)}
                                onPaste={this.handlers(Handler.Paste, rowIndex, columnIndex)}
                                type={column.type}
                                value={datum[column.id]}
                            />);
                        case CellType.Label:
                        default:
                            return (<CellLabel
                                className={className}
                                key={`column-${columnIndex}`}
                                onClick={this.handlers(Handler.Click, rowIndex, columnIndex)}
                                onDoubleClick={this.handlers(Handler.DoubleClick, rowIndex, columnIndex)}
                                value={formatters[columnIndex](datum[column.id])}
                            />);
                    }
                },
                columns
            ),
            data
        );
    });
}