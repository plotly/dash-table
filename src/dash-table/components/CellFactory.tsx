import * as R from 'ramda';
import React, { CSSProperties } from 'react';

import { matrixMap2, matrixMap3 } from 'core/math/matrixZipMap';
import { arrayMap2 } from 'core/math/arrayZipMap';

import { ICellFactoryProps } from 'dash-table/components/Table/props';
import derivedCellWrappers from 'dash-table/derived/cell/wrappers';
import derivedCellContents from 'dash-table/derived/cell/contents';
import derivedCellOperations from 'dash-table/derived/cell/operations';
import derivedCellStyles, { derivedDataOpStyles } from 'dash-table/derived/cell/wrapperStyles';
import derivedDropdowns from 'dash-table/derived/cell/dropdowns';
import { derivedRelevantCellStyles } from 'dash-table/derived/style';
import { IEdgesMatrices } from 'dash-table/derived/edges/type';
import { memoizeOne } from 'core/memoizer';

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
        private readonly dataOpStyles = derivedDataOpStyles(),
        private readonly cellWrappers = derivedCellWrappers(propsFn),
        private readonly relevantStyles = derivedRelevantCellStyles()
    ) { }

    public createCells(dataEdges: IEdgesMatrices | undefined, dataOpEdges: IEdgesMatrices | undefined) {
        const {
            active_cell,
            columns,
            dropdown_conditional,
            dropdown,
            data,
            dropdown_data,
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

        const cellStyles = this.cellStyles(
            columns,
            relevantStyles,
            virtualized.data,
            virtualized.offset,
            selected_cells
        );

        const dataOpStyles = this.dataOpStyles(
            (row_selectable ? 1 : 0) + (row_deletable ? 1 : 0),
            relevantStyles,
            virtualized.data,
            virtualized.offset
        );

        const dropdowns = this.cellDropdowns(
            columns,
            virtualized.data,
            virtualized.indices,
            dropdown_conditional,
            dropdown,
            dropdown_data
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
            !!is_focused,
            dropdowns
        );

        const ops = this.getDataOpCells(
            operations,
            dataOpStyles,
            dataOpEdges
        );

        const cells = this.getDataCells(
            cellWrappers,
            cellContents,
            cellStyles,
            dataEdges
        );

        return this.getCells(
            ops,
            cells
        );
    }

    getCells = memoizeOne((
        opCells: JSX.Element[][],
        dataCells: JSX.Element[][]
    ) => arrayMap2(
        opCells,
        dataCells,
        (o, c) => o.length ? o.concat(c) : c
    ));

    getDataOpCells = memoizeOne((
        ops: JSX.Element[][],
        styles: (CSSProperties | undefined)[][],
        edges: IEdgesMatrices | undefined
    ) => matrixMap2(
        ops,
        styles,
        (o, s, i, j) => React.cloneElement(o, {
            style: R.mergeAll([
                edges && edges.getStyle(i, j),
                s,
                o.props.style
            ])
        })
    ));

    getDataCells = memoizeOne((
        wrappers: JSX.Element[][],
        contents: JSX.Element[][],
        styles: (CSSProperties | undefined)[][],
        edges: IEdgesMatrices | undefined
    ) => matrixMap3(
        wrappers,
        styles,
        contents,
        (w, s, c, i, j) => React.cloneElement(w, {
            children: [c],
            style: R.mergeAll([
                s,
                edges && edges.getStyle(i, j)
            ])
        })
    ));
}
