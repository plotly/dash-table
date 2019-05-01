import * as R from 'ramda';

import { memoizeOne } from 'core/memoizer';

import derivedDataEdges from 'dash-table/derived/edges/data';
import derivedDataOpEdges from 'dash-table/derived/edges/operationOfData';
import derivedFilterEdges from 'dash-table/derived/edges/filter';
import derivedFilterOpEdges from 'dash-table/derived/edges/operationOfFilters';
import derivedHeaderEdges from 'dash-table/derived/edges/header';
import derivedHeaderOpEdges from 'dash-table/derived/edges/operationOfHeaders';
import { EdgesMatrices, IEdgesMatrices } from 'dash-table/derived/edges/type';

import getHeaderRows from 'dash-table/derived/header/headerRows';

import { derivedRelevantCellStyles, derivedRelevantFilterStyles, derivedRelevantHeaderStyles } from 'dash-table/derived/style';
import { Style, Cells, DataCells, BasicFilters, Headers } from 'dash-table/derived/style/props';

import { ControlledTableProps, VisibleColumns, IViewportOffset, Data } from './Table/props';

export default class EdgeFactory {
    private readonly dataStyles = derivedRelevantCellStyles();
    private readonly dataOpStyles = derivedRelevantCellStyles();
    private readonly filterStyles = derivedRelevantFilterStyles();
    private readonly filterOpStyles = derivedRelevantFilterStyles();
    private readonly headerStyles = derivedRelevantHeaderStyles();
    private readonly headerOpStyles = derivedRelevantHeaderStyles();

    private readonly getDataEdges = derivedDataEdges();
    private readonly getDataOpEdges = derivedDataOpEdges();
    private readonly getFilterEdges = derivedFilterEdges();
    private readonly getFilterOpEdges = derivedFilterOpEdges();
    private readonly getHeaderEdges = derivedHeaderEdges();
    private readonly getHeaderOpEdges = derivedHeaderOpEdges();

    private hReconcile(target: EdgesMatrices | undefined, next: EdgesMatrices | undefined, cutoffWeight: number): EdgesMatrices | undefined {
        if (!target || !next) {
            return target;
        }

        target = target.clone();

        const hNext = next.getMatrices().horizontal;
        const hTarget = target.getMatrices().horizontal;

        const iNext = 0;
        const iTarget = hTarget.rows - 1;

        R.forEach(j =>
            (
                hNext.getWeight(iNext, j) > cutoffWeight ||
                (hNext.getWeight(iNext, j) > hTarget.getWeight(iTarget, j))
            ) && hTarget.setEdge(iTarget, j, undefined, -Infinity, true),
            R.range(0, hTarget.columns)
        );

        return target;
    }

    private vReconcile(target: EdgesMatrices | undefined, next: EdgesMatrices | undefined, cutoffWeight: number): EdgesMatrices | undefined {
        if (!target || !next) {
            return target;
        }

        target = target.clone();

        const vNext = target.getMatrices().vertical;
        const vTarget = target.getMatrices().vertical;

        const jNext = 0;
        const jTarget = vTarget.columns - 1;

        R.forEach(i =>
            (
                vNext.getWeight(i, jNext) > cutoffWeight ||
                (vNext.getWeight(i, jNext) > vTarget.getWeight(i, jTarget))
            ) && vTarget.setEdge(i, jTarget, undefined, -Infinity, true),
            R.range(0, vTarget.rows)
        );

        return target;
    }

    private get props() {
        return this.propsFn();
    }

    constructor(private readonly propsFn: () => ControlledTableProps) {

    }

    public createEdges() {
        const {
            columns,
            filtering,
            row_deletable,
            row_selectable,
            style_cell,
            style_cell_conditional,
            style_data,
            style_data_conditional,
            style_filter,
            style_filter_conditional,
            style_header,
            style_header_conditional,
            virtualized
        } = this.props;

        return this.memoizedCreateEdges(
            columns,
            (row_deletable ? 1 : 0) + (row_selectable ? 1 : 0),
            !!filtering,
            style_cell,
            style_cell_conditional,
            style_data,
            style_data_conditional,
            style_filter,
            style_filter_conditional,
            style_header,
            style_header_conditional,
            virtualized.data,
            virtualized.offset
        );
    }

    private memoizedCreateEdges = memoizeOne((
        columns: VisibleColumns,
        operations: number,
        filtering: boolean,
        style_cell: Style,
        style_cell_conditional: Cells,
        style_data: Style,
        style_data_conditional: DataCells,
        style_filter: Style,
        style_filter_conditional: BasicFilters,
        style_header: Style,
        style_header_conditional: Headers,
        data: Data,
        offset: IViewportOffset
    ) => {
        let dataEdges = this.getDataEdges(
            columns,
            this.dataStyles(
                style_cell,
                style_data,
                style_cell_conditional,
                style_data_conditional
            ),
            data,
            offset
        );

        let dataOpEdges = this.getDataOpEdges(
            operations,
            this.dataOpStyles(
                style_cell,
                style_data,
                R.filter(s => R.isNil(s.if) || (R.isNil(s.if.column_id) && R.isNil(s.if.column_type)), style_cell_conditional),
                R.filter(s => R.isNil(s.if) || (R.isNil(s.if.column_id) && R.isNil(s.if.column_type)), style_data_conditional)
            ),
            data,
            offset
        );

        let filterEdges = this.getFilterEdges(
            columns,
            filtering,
            this.filterStyles(
                style_cell,
                style_filter,
                style_cell_conditional,
                style_filter_conditional
            )
        );

        let filterOpEdges = this.getFilterOpEdges(
            operations,
            filtering,
            this.filterOpStyles(
                style_cell,
                style_filter,
                R.filter(s => R.isNil(s.if) || (R.isNil(s.if.column_id) && R.isNil(s.if.column_type)), style_cell_conditional),
                R.filter(s => R.isNil(s.if) || (R.isNil(s.if.column_id) && R.isNil(s.if.column_type)), style_filter_conditional)
            )
        );

        let headerEdges = this.getHeaderEdges(
            columns,
            getHeaderRows(columns),
            this.headerStyles(
                style_cell,
                style_header,
                style_cell_conditional,
                style_header_conditional
            )
        );

        let headerOpEdges = this.getHeaderOpEdges(
            operations,
            getHeaderRows(columns),
            this.headerOpStyles(
                style_cell,
                style_header,
                R.filter(s => R.isNil(s.if) || (R.isNil(s.if.column_id) && R.isNil(s.if.column_type)), style_cell_conditional),
                R.filter(s => R.isNil(s.if) || (R.isNil(s.if.column_id) && R.isNil(s.if.column_type) && R.isNil(s.if.header_index)), style_header_conditional)
            )
        );

        const cutoffWeight = (style_cell ? 1 : 0) + style_cell_conditional.length - 1;

        headerEdges = this.hReconcile(headerEdges, filterEdges || dataEdges, cutoffWeight);
        headerOpEdges = this.hReconcile(headerOpEdges, filterOpEdges || dataOpEdges, cutoffWeight);
        filterEdges = this.hReconcile(filterEdges, dataEdges, cutoffWeight);
        filterOpEdges = this.hReconcile(filterOpEdges, dataOpEdges, cutoffWeight);

        headerOpEdges = this.vReconcile(headerOpEdges, headerEdges, cutoffWeight);
        filterOpEdges = this.vReconcile(filterOpEdges, filterEdges, cutoffWeight);
        dataOpEdges = this.vReconcile(dataOpEdges, dataEdges, cutoffWeight);

        return {
            dataEdges: dataEdges as (IEdgesMatrices | undefined),
            dataOpEdges: dataOpEdges as (IEdgesMatrices | undefined),
            filterEdges: filterEdges as (IEdgesMatrices | undefined),
            filterOpEdges: filterOpEdges as (IEdgesMatrices | undefined),
            headerEdges: headerEdges as (IEdgesMatrices | undefined),
            headerOpEdges: headerOpEdges as (IEdgesMatrices | undefined)
        };
    });
}