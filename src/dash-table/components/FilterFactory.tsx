import * as R from 'ramda';
import React from 'react';

import Logger from 'core/Logger';
import { arrayMap } from 'core/math/arrayZipMap';
import { memoizeOne } from 'core/memoizer';

import ColumnFilter from 'dash-table/components/Filter/Column';
import { ColumnId, Filtering, FilteringType, IVisibleColumn, VisibleColumns, RowSelection } from 'dash-table/components/Table/props';
import derivedFilterStyles from 'dash-table/derived/filter/wrapperStyles';
import derivedHeaderOperations from 'dash-table/derived/header/operations';
import { derivedRelevantFilterStyles } from 'dash-table/derived/style';
import { BasicFilters, Cells, Style } from 'dash-table/derived/style/props';
import { MultiColumnsSyntaxTree, SingleColumnSyntaxTree, getMultiColumnQueryString, getSingleColumnMap } from 'dash-table/syntax-tree';

type SetFilter = (filter: string, rawFilter: string) => void;

export interface IFilterOptions {
    columns: VisibleColumns;
    filtering: Filtering;
    filtering_settings: string;
    filtering_type: FilteringType;
    id: string;
    rawFilterQuery: string;
    row_deletable: boolean;
    row_selectable: RowSelection;
    setFilter: SetFilter;
    style_cell: Style;
    style_cell_conditional: Cells;
    style_filter: Style;
    style_filter_conditional: BasicFilters;
}

export default class FilterFactory {
    private readonly handlers = new Map();
    private readonly filterStyles = derivedFilterStyles();
    private readonly relevantStyles = derivedRelevantFilterStyles();
    private readonly headerOperations = derivedHeaderOperations();

    private ops = new Map<string, SingleColumnSyntaxTree>();

    private get props() {
        return this.propsFn();
    }

    constructor(private readonly propsFn: () => IFilterOptions) {

    }

    private onChange = (columnId: ColumnId, ops: Map<ColumnId, SingleColumnSyntaxTree>, setFilter: SetFilter, ev: any) => {
        Logger.debug('Filter -- onChange', columnId, ev.target.value && ev.target.value.trim());

        const value = ev.target.value.trim();
        const safeColumnId = columnId.toString();

        if (value && value.length) {
            ops.set(safeColumnId, new SingleColumnSyntaxTree(safeColumnId, value));
        } else {
            ops.delete(safeColumnId);
        }

        const asts = Array.from(ops.values());
        const globalFilter = getMultiColumnQueryString(asts);

        const rawGlobalFilter = R.map(
            ast => ast.query || '',
            R.filter(ast => Boolean(ast), asts)
        ).join(' && ');

        setFilter(globalFilter, rawGlobalFilter);
    }

    private getEventHandler = (fn: Function, columnId: ColumnId, ops: Map<ColumnId, SingleColumnSyntaxTree>, setFilter: SetFilter): any => {
        const fnHandler = (this.handlers.get(fn) || this.handlers.set(fn, new Map()).get(fn));
        const columnIdHandler = (fnHandler.get(columnId) || fnHandler.set(columnId, new Map()).get(columnId));

        return (
            columnIdHandler.get(setFilter) ||
            (columnIdHandler.set(setFilter, fn.bind(this, columnId, ops, setFilter)).get(setFilter))
        );
    }

    private updateOps = memoizeOne((query: string) => {
        const ast = new MultiColumnsSyntaxTree(query);

        this.ops = getSingleColumnMap(ast) || this.ops;
    });

    public createFilters() {
        const {
            columns,
            filtering,
            filtering_settings,
            filtering_type,
            row_deletable,
            row_selectable,
            setFilter,
            style_cell,
            style_cell_conditional,
            style_filter,
            style_filter_conditional
        } = this.props;

        if (!filtering) {
            return [];
        }

        this.updateOps(filtering_settings);

        if (filtering_type === FilteringType.Basic) {
            const filterStyles = this.relevantStyles(
                style_cell,
                style_filter,
                style_cell_conditional,
                style_filter_conditional
            );

            const wrapperStyles = this.filterStyles(
                columns,
                filterStyles
            );

            const filters = R.addIndex<IVisibleColumn, JSX.Element>(R.map)((column, index) => {
                const ast = this.ops.get(column.id.toString());

                return (<ColumnFilter
                    key={`column-${index}`}
                    classes={`dash-filter column-${index}`}
                    columnId={column.id}
                    isValid={!ast || ast.isValid}
                    setFilter={this.getEventHandler(this.onChange, column.id, this.ops, setFilter)}
                    value={ast && ast.query}
                />);
            }, columns);

            const styledFilters = arrayMap(
                filters,
                wrapperStyles,
                    (f, s) => React.cloneElement(f, { style: s }));

            const operations = this.headerOperations(
                1,
                row_selectable,
                row_deletable
            )[0];

            return [operations.concat(styledFilters)];
        } else {
            return [[]];
        }
    }
}