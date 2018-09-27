import * as R from 'ramda';
import React from 'react';

import { memoizeOneFactory } from 'core/memoizer';

import {
    ActiveCell,
    Dataframe,
    Datum,
    IVisibleColumn,
    VisibleColumns,
    ICellFactoryOptions
} from 'dash-table/components/Table/props';
import CellInput from 'dash-table/components/CellInput';
import derivedCellEventHandlerProps from 'dash-table/derived/ui/cellEventHandlerProps';

const mapDataframe = R.addIndex<Datum, JSX.Element[]>(R.map);
const mapRow = R.addIndex<IVisibleColumn, JSX.Element>(R.map);

const cellEventHandlerProps = derivedCellEventHandlerProps();

const getter = (
    activeCell: ActiveCell,
    columns: VisibleColumns,
    dataframe: Dataframe,
    columnConditionalDropdown: any,
    columnStaticDropdown: any,
    dropdown_properties: any,
    editable: boolean,
    isFocused: boolean,
    tableId: string,
    propsFn: () => ICellFactoryOptions
): JSX.Element[][] => mapDataframe(
    (datum, rowIndex) => mapRow(
        (column, columnIndex) => {
            const active = activeCell[0] === rowIndex && activeCell[1] === columnIndex;

            let legacyDropdown: any = (
                (
                    dropdown_properties &&
                    dropdown_properties[column.id] &&
                    (
                        dropdown_properties[column.id].length > rowIndex ?
                            dropdown_properties[column.id][rowIndex] :
                            null
                    )
                ) || column || {}
            ).options;

            const handlers = cellEventHandlerProps(propsFn)(rowIndex, columnIndex);

            let conditionalDropdowns = columnConditionalDropdown.find((cs: any) => cs.id === column.id);
            let staticDropdown = columnStaticDropdown.find((ss: any) => ss.id === column.id);

            conditionalDropdowns = (conditionalDropdowns && conditionalDropdowns.styles) || [];
            staticDropdown = legacyDropdown || (staticDropdown && staticDropdown.dropdown);

            return (<CellInput
                key={`column-${columnIndex}`}
                active={active}
                clearable={column.clearable}
                conditionalDropdowns={conditionalDropdowns}
                datum={datum}
                editable={editable}
                focused={isFocused}
                property={column.id}
                staticDropdown={staticDropdown}
                tableId={tableId}
                type={column.type}
                value={datum[column.id]}
                {...handlers}
            />);
        },
        columns
    ),
    dataframe
);

export default memoizeOneFactory(getter);
