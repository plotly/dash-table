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
import { SingleColumnSyntaxTree, getMultiColumnQueryString } from 'dash-table/syntax-tree';

import { IEdgesMatrices } from 'dash-table/derived/edges/type';
import { updateMap } from 'dash-table/derived/filter/asts';

type SetFilter = (
    filter: string,
    rawFilter: string,
    map: Map<string, SingleColumnSyntaxTree>
) => void;

export interface IFilterOptions {
    columns: VisibleColumns;
    filter: string;
    filtering: Filtering;
    filtering_type: FilteringType;
    id: string;
    map: Map<string, SingleColumnSyntaxTree>;
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

    private get props() {
        return this.propsFn();
    }

    constructor(private readonly propsFn: () => IFilterOptions) {

    }

    private onChange = (column: IVisibleColumn, map: Map<string, SingleColumnSyntaxTree>, setFilter: SetFilter, ev: any) => {
        Logger.debug('Filter -- onChange', column.id, ev.target.value && ev.target.value.trim());

        const value = ev.target.value.trim();

        map = updateMap(map, column, value);

        const asts = Array.from(map.values());
        const globalFilter = getMultiColumnQueryString(asts);

        const rawGlobalFilter = R.map(
            ast => ast.query || '',
            R.filter<SingleColumnSyntaxTree>(ast => Boolean(ast), asts)
        ).join(' && ');

        setFilter(globalFilter, rawGlobalFilter, map);
    }

    private getEventHandler = (
        fn: Function,
        column: IVisibleColumn,
        map: Map<string, SingleColumnSyntaxTree>,
        setFilter: SetFilter
    ): any => {
        const fnHandler = (this.handlers.get(fn) || this.handlers.set(fn, new Map()).get(fn));
        const columnIdHandler = (fnHandler.get(column.id) || fnHandler.set(column.id, new Map()).get(column.id));

        return (
            columnIdHandler.get(setFilter) ||
            (columnIdHandler.set(setFilter, fn.bind(this, column, map, setFilter)).get(setFilter))
        );
    }

    private filter = memoizerCache<[ColumnId, number]>()((
        column: IVisibleColumn,
        index: number,
        setFilter: SetFilter
    ) => {
        const { map } = this.props;

        const ast = map.get(column.id.toString());

        return (<ColumnFilter
            key={`column-${index}`}
            classes={`dash-filter column-${index}`}
            columnId={column.id}
            isValid={!ast || ast.isValid}
            setFilter={this.getEventHandler(this.onChange, column, map, setFilter)}
            value={ast && ast.query}
        />);
    });

    private wrapperStyles = memoizeOne((
        styles: any[],
        edges: IEdgesMatrices | undefined
    ) => arrayMap(
        styles,
        (s, j) => R.merge(
            s,
            edges && edges.getStyle(0, j)
        )
    ));

    public createFilters(
        filterEdges: IEdgesMatrices | undefined,
        filterOpEdges: IEdgesMatrices | undefined
    ) {
        const {
            columns,
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

        if (filtering_type === FilteringType.Basic) {
            const relevantStyles = this.relevantStyles(
                style_cell,
                style_filter,
                style_cell_conditional,
                style_filter_conditional
            );

            const wrapperStyles = this.wrapperStyles(
                this.filterStyles(columns, relevantStyles),
                filterEdges
            );

            const filters = R.addIndex<IVisibleColumn, JSX.Element>(R.map)((column, index) => {
                return this.filter.get(column.id, index)(
                    column,
                    index,
                    setFilter
                );
            }, columns);

            const styledFilters = arrayMap2(
                filters,
                wrapperStyles,
                (f, s) => React.cloneElement(f, {
                    style: s
                })
            );

            const operations = this.headerOperations(
                1,
                row_selectable,
                row_deletable
            )[0];

            const operators = arrayMap(
                operations,
                (o, j) => React.cloneElement(o, {
                    style: filterOpEdges && filterOpEdges.getStyle(0, j)
                })
            );

            return [operators.concat(styledFilters)];
        } else {
            return [[]];
        }
    }
}