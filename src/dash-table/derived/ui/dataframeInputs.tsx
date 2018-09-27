import * as R from 'ramda';
import React from 'react';
import Dropdown from 'react-select';

import { memoizeOneFactory } from 'core/memoizer';

import {
    ActiveCell,
    ColumnType,
    Dataframe,
    Datum,
    IVisibleColumn,
    VisibleColumns
} from 'dash-table/components/Table/props';

const datumDiv = (value: any) => (<div>{value}</div>);
const datumInput = (value: any) => (<input type='text' defaultValue={value} />);
const datumDropdown = (value: any, clearable: boolean | undefined) => (<Dropdown
    ref='dropdown'
    clearable={clearable}
    onChange={() => {}}
    options={[]}
    placeholder={''}
    value={value}
/>);

const datumElement = (
    activeCell: ActiveCell,
    columnIdx: number,
    rowIdx: number,
    column: IVisibleColumn,
    value: any
): JSX.Element => {
    const active = activeCell[0] === rowIdx && activeCell[1] === columnIdx;

    switch (column.type) {
        case ColumnType.Text:
        case ColumnType.Numeric:
            return active ? datumInput(value) : datumDiv(value);
        case ColumnType.Dropdown:
            return datumDropdown(value, column.clearable);
        default:
            return datumDiv(value);
    }
};

const mapDataframe = R.addIndex<Datum, JSX.Element[]>(R.map);
const mapRow = R.addIndex<IVisibleColumn, JSX.Element>(R.map);

const getter = (
    activeCell: ActiveCell,
    columns: VisibleColumns,
    dataframe: Dataframe
): JSX.Element[][] => mapDataframe(
    (data, rowIdx) => mapRow(
        (column, columnIdx) => datumElement(
            activeCell,
            columnIdx,
            rowIdx,
            column,
            data[column.id]
        ),
        columns
    ),
    dataframe
);

export default memoizeOneFactory(getter);
