import * as R from 'ramda';
import React from 'react';

import { memoizeOneFactory } from 'core/memoizer';

import {
    ActiveCell,
    Dataframe,
    Datum,
    IVisibleColumn,
    VisibleColumns,
    ICellFactoryOptions,
    ColumnId
} from 'dash-table/components/Table/props';
import CellInput from 'dash-table/components/CellInput';
import derivedCellEventHandlerProps from 'dash-table/derived/cell/eventHandlerProps';
import SyntaxTree from 'core/syntax-tree';
import memoizerCache from 'core/memoizerCache';
import isActiveCell from 'dash-table/derived/cell/isActive';

interface IDropdownOption {
    label: string;
    value: string;
}

type IDropdownOptions = IDropdownOption[];

interface IConditionalDropdown {
    condition: string;
    dropdown: IDropdownOptions;
}

const mapDataframe = R.addIndex<Datum, JSX.Element[]>(R.map);
const mapRow = R.addIndex<IVisibleColumn, JSX.Element>(R.map);

const cellEventHandlerProps = derivedCellEventHandlerProps();

const dropdownAstCache = memoizerCache<[string, ColumnId, number], [string], SyntaxTree>(
    (query: string) => new SyntaxTree(query)
);

// private getDropdown = memoizeOne((...dropdowns: IDropdownOptions[]): IDropdownOptions | undefined => {
//     return dropdowns.length ? dropdowns.slice(-1)[0] : undefined;
// });

const getDropdown = (
    conditionalDropdowns: any,
    datum: Datum,
    property: ColumnId,
    staticDropdown: any,
    tableId: string
) => {
    const dropdowns = [
        ...(staticDropdown ? [staticDropdown] : []),
        ...R.map(
            ([cd]) => cd.dropdown,
            R.filter(
                ([cd, i]) => dropdownAstCache([tableId, property, i], cd.condition).evaluate(datum),
                R.addIndex<IConditionalDropdown, [IConditionalDropdown, number]>(R.map)(
                    (cd, i) => [cd, i],
                    conditionalDropdowns
                ))
        )
    ];

    return dropdowns.length ? dropdowns.slice(-1)[0] : undefined;
};

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
            const active = isActiveCell(activeCell, rowIndex, columnIndex);

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
                dropdown={getDropdown(conditionalDropdowns, datum, column.id, staticDropdown, tableId)}
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
