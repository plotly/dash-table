import * as R from 'ramda';
import React from 'react';

import Logger from 'core/Logger';
import { arrayMap, arrayMap2 } from 'core/math/arrayZipMap';
import memoizerCache from 'core/cache/memoizer';
import { memoizeOne } from 'core/memoizer';

import ColumnFilter from 'dash-table/components/Filter/Column';
import { ColumnId, Filtering, FilteringType, IVisibleColumn, VisibleColumns, RowSelection } from 'dash-table/components/Table/props';
import derivedFilterStyles from 'dash-table/derived/filter/wrapperStyles';
import derivedHeaderOperations from 'dash-table/derived/header/operations';
import { derivedRelevantFilterStyles } from 'dash-table/derived/style';
import { BasicFilters, Cells, Style } from 'dash-table/derived/style/props';
import { MultiColumnsSyntaxTree, SingleColumnSyntaxTree, getMultiColumnQueryString, getSingleColumnMap } from 'dash-table/syntax-tree';

import derivedFilterEdges from 'dash-table/derived/edges/filter';
import derivedOperationEdges from 'dash-table/derived/edges/operationOfFilters';

type SetFilter = (filter: string, rawFilter: string) => void;

export interface IFilterOptions {
    columns: VisibleColumns;
    filter: string;
    filtering: Filtering;
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

    private readonly filterEdges = derivedFilterEdges();
    private readonly filterOperationEdges = derivedOperationEdges();

    private ops = new Map<string, SingleColumnSyntaxTree>();

    private get props() {
        return this.propsFn();
    }

    constructor(private readonly propsFn: () => IFilterOptions) {

    }

    private onChange = (column: IVisibleColumn, setFilter: SetFilter, ev: any) => {
        Logger.debug('Filter -- onChange', column.id, ev.target.value && ev.target.value.trim());

        const value = ev.target.value.trim();
        const safeColumnId = column.id.toString();

        if (value && value.length) {
            this.ops.set(safeColumnId, new SingleColumnSyntaxTree(value, column));
        } else {
            this.ops.delete(safeColumnId);
        }

        const asts = Array.from(this.ops.values());
        const globalFilter = getMultiColumnQueryString(asts);

        const rawGlobalFilter = R.map(
            ast => ast.query || '',
            R.filter<SingleColumnSyntaxTree>(ast => Boolean(ast), asts)
        ).join(' && ');

        setFilter(globalFilter, rawGlobalFilter);
    }

    private getEventHandler = (fn: Function, column: IVisibleColumn, setFilter: SetFilter): any => {
        const fnHandler = (this.handlers.get(fn) || this.handlers.set(fn, new Map()).get(fn));
        const columnIdHandler = (fnHandler.get(column.id) || fnHandler.set(column.id, new Map()).get(column.id));

        return (
            columnIdHandler.get(setFilter) ||
            (columnIdHandler.set(setFilter, fn.bind(this, column, setFilter)).get(setFilter))
        );
    }

    private updateOps = memoizeOne((query: string, columns: IVisibleColumn[]) => {
        const multiQuery = new MultiColumnsSyntaxTree(query);

        const newOps = getSingleColumnMap(multiQuery, columns);
        if (!newOps) {
            return;
        }

        /* Mapping multi-column to single column queries will expand
         * compressed forms. If the new ast query is equal to the
         * old one, keep the old one instead.
         *
         * If the value was changed by the user, the current ast will
         * have been modified already and the UI experience will also
         * be consistent in that case.
         */
        R.forEach(([key, ast]) => {
            const newAst = newOps.get(key);

            if (newAst && newAst.toQueryString() === ast.toQueryString()) {
                newOps.set(key, ast);
            }
        }, Array.from(this.ops.entries()));

        this.ops = newOps;
    });

    private filter = memoizerCache<[ColumnId, number]>()((
        column: IVisibleColumn,
        index: number,
        ast: SingleColumnSyntaxTree | undefined,
        setFilter: SetFilter
    ) => {
        return (<ColumnFilter
            key={`column-${index}`}
            classes={`dash-filter column-${index}`}
            columnId={column.id}
            isValid={!ast || ast.isValid}
            setFilter={this.getEventHandler(this.onChange, column, setFilter)}
            value={ast && ast.query}
        />);
    });

    public createFilters() {
        const {
            columns,
            filter,
            filtering,
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

        this.updateOps(filter, columns);

        if (filtering_type === FilteringType.Basic) {
            const relevantStyles = this.relevantStyles(
                style_cell,
                style_filter,
                style_cell_conditional,
                style_filter_conditional
            );

            const operationRelevantStyles = this.relevantStyles(
                style_cell,
                style_filter,
                R.filter(s => R.isNil(s.if) || (R.isNil(s.if.column_id) && R.isNil(s.if.column_type)), style_cell_conditional),
                R.filter(s => R.isNil(s.if) || (R.isNil(s.if.column_id) && R.isNil(s.if.column_type)), style_filter_conditional)
            );

            const filterEdges = this.filterEdges(
                columns,
                true,
                relevantStyles
            );

            const operationBorders = this.filterOperationEdges(
                (row_selectable !== false ? 1 : 0) + (row_deletable ? 1 : 0),
                1,
                operationRelevantStyles
            );

            const wrapperStyles = this.filterStyles(
                columns,
                relevantStyles
            );

            const filters = R.addIndex<IVisibleColumn, JSX.Element>(R.map)((column, index) => {
                return this.filter.get(column.id, index)(
                    column,
                    index,
                    this.ops.get(column.id.toString()),
                    setFilter
                );
            }, columns);

            const styledFilters = arrayMap2(
                filters,
                wrapperStyles,
                (f, s, j) => React.cloneElement(f, {
                    classes: f.props.classes + ` dash-filter-row`,
                    style: R.merge(
                        s,
                        filterEdges && filterEdges.getStyle(0, j)
                    )
                })
            );

            const operations = this.headerOperations(
                1,
                row_selectable,
                row_deletable
            )[0];

            const ops = arrayMap(
                operations,
                (o, j) => React.cloneElement(o, {
                    className: o.props.className + ` dash-filter-row`,
                    style: operationBorders && operationBorders.getStyle(0, j)
                })
            );

            return [ops.concat(styledFilters)];
        } else {
            return [[]];
        }
    }
}