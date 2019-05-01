import * as R from 'ramda';
import React from 'react';

import { ICellFactoryProps } from 'dash-table/components/Table/props';
import derivedCellWrappers from 'dash-table/derived/cell/wrappers';
import derivedCellContents from 'dash-table/derived/cell/contents';
import derivedCellOperations from 'dash-table/derived/cell/operations';
import derivedCellStyles from 'dash-table/derived/cell/wrapperStyles';
import derivedDropdowns from 'dash-table/derived/cell/dropdowns';
import { derivedRelevantCellStyles } from 'dash-table/derived/style';

import derivedDataEdges from 'dash-table/derived/edges/data';
import derivedOperationEdges from 'dash-table/derived/edges/operationOfData';

import { matrixMap, matrixMap3 } from 'core/math/matrixZipMap';
import { arrayMap2 } from 'core/math/arrayZipMap';

export default class CellFactory {

    private get props() {
        return this.propsFn();
    }

    constructor(
        private readonly propsFn: () => ICellFactoryProps,
        private readonly cellContents = derivedCellContents(propsFn),
        private readonly cellDropdowns = derivedDropdowns(),
        private readonly cellOperations = derivedCellOperations(),
        private readonly cellStyles = derivedCellStyles(),
        private readonly cellWrappers = derivedCellWrappers(propsFn),
        private readonly relevantStyles = derivedRelevantCellStyles(),
        private readonly relevantOperationStyles = derivedRelevantCellStyles(),

        private readonly dataEdges = derivedDataEdges(),
        private readonly dataOperationEdges = derivedOperationEdges()
    ) { }

    public createCells() {
        const {
            active_cell,
            columns,
            column_conditional_dropdowns,
            column_static_dropdown,
            data,
            dropdown_properties, // legacy
            editable,
            is_focused,
            row_deletable,
            row_selectable,
            selected_cells,
            selected_rows,
            setProps,
            style_cell,
            style_cell_conditional,
            style_data,
            style_data_conditional,
            virtualized
        } = this.props;

        const relevantStyles = this.relevantStyles(
            style_cell,
            style_data,
            style_cell_conditional,
            style_data_conditional
        );

        const relevantOperationStyles = this.relevantOperationStyles(
            style_cell,
            style_data,
            R.filter(s => R.isNil(s.if) || (R.isNil(s.if.column_id) && R.isNil(s.if.column_type)), style_cell_conditional),
            R.filter(s => R.isNil(s.if) || (R.isNil(s.if.column_id) && R.isNil(s.if.column_type)), style_data_conditional)
        );

        const operations = this.cellOperations(
            data,
            virtualized.data,
            virtualized.indices,
            row_selectable,
            row_deletable,
            selected_rows,
            setProps
        );

        const cellBorders = this.dataEdges(
            columns,
            relevantStyles,
            virtualized.data,
            virtualized.offset
        );

        const operationBorders = this.dataOperationEdges(
            (row_selectable !== false ? 1 : 0) + (row_deletable ? 1 : 0),
            relevantOperationStyles,
            virtualized.data,
            virtualized.offset
        );

        const cellStyles = this.cellStyles(
            columns,
            relevantStyles,
            virtualized.data,
            virtualized.offset
        );

        const dropdowns = this.cellDropdowns(
            columns,
            virtualized.data,
            virtualized.indices,
            column_conditional_dropdowns,
            column_static_dropdown,
            dropdown_properties
        );

        const cellWrappers = this.cellWrappers(
            active_cell,
            columns,
            virtualized.data,
            virtualized.offset,
            selected_cells
        );

        const cellContents = this.cellContents(
            active_cell,
            columns,
            virtualized.data,
            virtualized.offset,
            editable,
            !!is_focused,
            dropdowns
        );

        const ops = matrixMap(
            operations,
            (o, i, j) => React.cloneElement(o, {
                style: operationBorders && operationBorders.getStyle(i, j)
            })
        );

        const cells = matrixMap3(
            cellWrappers,
            cellStyles,
            cellContents,
            (w, s, c, i, j) => React.cloneElement(w, {
                children: [c],
                style: R.mergeAll([
                    s,
                    cellBorders && cellBorders.getStyle(i, j)
                ])
            })
        );

        return arrayMap2(
            ops,
            cells,
            (o, c) => Array.prototype.concat(o, c)
        );
    }
}
