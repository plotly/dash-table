import React from 'react';

import { ICellFactoryOptions } from 'dash-table/components/Table/props';
import derivedCellWrappers from 'dash-table/derived/cell/wrappers';
import derivedCellInputs from 'dash-table/derived/cell/inputs';
import derivedCellOperations from 'dash-table/derived/cell/operations';
import derivedCellStyles from 'dash-table/derived/cell/wrapperStyles';
import { matrixMap3 } from 'core/math/matrixZipMap';
import { arrayMap } from 'core/math/arrayZipMap';

export default class CellFactory {
    private readonly cellWrappers = derivedCellWrappers();
    private readonly cellInputs = derivedCellInputs();
    private readonly cellOperations = derivedCellOperations();
    private readonly cellStyles = derivedCellStyles();

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

        const operations = this.cellOperations(
            active_cell,
            dataframe,
            viewport.dataframe,
            viewport.indices,
            row_selectable,
            row_deletable,
            selected_rows,
            setProps
        );

        const wrappers = this.cellWrappers(
            active_cell,
            columns,
            viewport.dataframe,
            editable,
            selected_cell
        );

        const wrapperStyles = this.cellStyles(id)(
            columns,
            column_conditional_styles,
            column_static_style,
            viewport.dataframe
        );

        const inputs = this.cellInputs(
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

        const cells = matrixMap3(
            wrappers,
            wrapperStyles,
            inputs,
            (w, s, i) => React.cloneElement(w, { children: [i], style: s })
        );

        return arrayMap(
            operations,
            cells,
            (o, c) => [...o, ...c]
        );
    }
}