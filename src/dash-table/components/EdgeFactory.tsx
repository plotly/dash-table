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

import { ControlledTableProps, VisibleColumns, IViewportOffset, Data, ICellCoordinates } from './Table/props';
import { SingleColumnSyntaxTree } from 'dash-table/syntax-tree';

export default class EdgeFactory {
    private readonly dataStyles = derivedRelevantCellStyles();
    private readonly filterStyles = derivedRelevantFilterStyles();
    private readonly headerStyles = derivedRelevantHeaderStyles();

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
                (hNext.getWeight(iNext, j) > cutoffWeight && hTarget.getWeight(iTarget, j) !== Infinity) ||
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
                (vNext.getWeight(i, jNext) > cutoffWeight && vTarget.getWeight(i, jTarget) !== Infinity) ||
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
            active_cell,
            columns,
            filtering,
            map,
            row_deletable,
            row_selectable,
            style_as_list_view,
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
            active_cell,
            columns,
            (row_deletable ? 1 : 0) + (row_selectable ? 1 : 0),
            !!filtering,
            map,
            style_as_list_view,
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
        active_cell: ICellCoordinates,
        columns: VisibleColumns,
        operations: number,
        filtering: boolean,
        filterMap: Map<string, SingleColumnSyntaxTree>,
        style_as_list_view: boolean,
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
        const dataStyles = this.dataStyles(
            style_cell,
            style_data,
            style_cell_conditional,
            style_data_conditional
        );

        const filterStyles = this.filterStyles(
            style_cell,
            style_filter,
            style_cell_conditional,
            style_filter_conditional
        );

        const headerStyles = this.headerStyles(
            style_cell,
            style_header,
            style_cell_conditional,
            style_header_conditional
        );

        let dataEdges = this.getDataEdges(
            columns,
            dataStyles,
            data,
            offset,
            active_cell,
            style_as_list_view
        );

        let dataOpEdges = this.getDataOpEdges(
            operations,
            dataStyles,
            data,
            offset,
            style_as_list_view
        );

        let filterEdges = this.getFilterEdges(
            columns,
            filtering,
            filterMap,
            filterStyles,
            style_as_list_view
        );

        let filterOpEdges = this.getFilterOpEdges(
            operations,
            filtering,
            filterStyles,
            style_as_list_view
        );

        let headerEdges = this.getHeaderEdges(
            columns,
            getHeaderRows(columns),
            headerStyles,
            style_as_list_view
        );

        let headerOpEdges = this.getHeaderOpEdges(
            operations,
            getHeaderRows(columns),
            headerStyles,
            style_as_list_view
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