import * as R from 'ramda';
import React from 'react';

import { ICellFactoryOptions } from 'dash-table/components/Table/props';
import derivedDataframeCells from 'dash-table/derived/cell/wrappers';
import derivedDataframeInputs from 'dash-table/derived/cell/inputs';
import derivedDataframeOperations from 'dash-table/derived/cell/operations';

export default class CellFactory {
    private readonly dataframeCells = derivedDataframeCells();
    private readonly dataframeInputs = derivedDataframeInputs();
    private readonly dataframeOperations = derivedDataframeOperations();

    private get props() {
        return this.propsFn();
    }

    constructor(private readonly propsFn: () => ICellFactoryOptions) {

    }

    public createCells() {
        const {
            active_cell,
            columns,
            column_conditional_dropdowns,
            column_conditional_styles,
            column_static_dropdown,
            column_static_style,
            dataframe,
            dropdown_properties, // legacy
            editable,
            id,
            is_focused,
            row_deletable,
            row_selectable,
            selected_cell,
            selected_rows,
            setProps,
            viewport
        } = this.props;

        const operations = this.dataframeOperations(
            active_cell,
            dataframe,
            viewport.dataframe,
            viewport.indices,
            row_selectable,
            row_deletable,
            selected_rows,
            setProps
        );

        const wrappers = this.dataframeCells(
            active_cell,
            columns,
            column_conditional_styles,
            column_static_style,
            viewport.dataframe,
            editable,
            id,
            selected_cell
        );

        const inputs = this.dataframeInputs(
            active_cell,
            columns,
            viewport.dataframe,
            column_conditional_dropdowns,
            column_static_dropdown,
            dropdown_properties,
            editable,
            !!is_focused,
            id,
            this.propsFn
        );

        const tuples = R.map(
            ([i, w]) => R.zip(i, w),
            R.zip(inputs, wrappers)
        );

        const cells = R.map(
            row => R.map(
                ([input, wrapper]) => React.cloneElement(wrapper, { children: [input] }),
                row
            ),
            tuples
        );

        return R.map(
            ([o, c]) => [...o, ...c],
            R.zip(operations, cells)
        );
    }
}