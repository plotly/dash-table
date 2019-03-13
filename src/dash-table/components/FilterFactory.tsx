import * as R from 'ramda';
import React from 'react';

import Logger from 'core/Logger';
import { arrayMap } from 'core/math/arrayZipMap';
import { LexemeType } from 'core/syntax-tree/lexicon';

import ColumnFilter from 'dash-table/components/Filter/Column';
import { ColumnId, Filtering, FilteringType, IVisibleColumn, VisibleColumns } from 'dash-table/components/Table/props';
import derivedFilterStyles from 'dash-table/derived/filter/wrapperStyles';
import { derivedRelevantFilterStyles } from 'dash-table/derived/style';
import { BasicFilters, Cells, Style } from 'dash-table/derived/style/props';
import { MultiColumnsSyntaxTree, SingleColumnSyntaxTree } from 'dash-table/syntax-tree';

type SetFilter = (filter: string) => void;

export interface IFilterOptions {
    columns: VisibleColumns;
    fillerColumns: number;
    filtering: Filtering;
    filtering_settings: string;
    filtering_type: FilteringType;
    id: string;
    setFilter: SetFilter;
    style_cell: Style;
    style_cell_conditional: Cells;
    style_filter: Style;
    style_filter_conditional: BasicFilters;
}

export default class FilterFactory {
    private readonly handlers = new Map();
    private readonly ops = new Map<string, string>();
    private readonly filterStyles = derivedFilterStyles();
    private readonly relevantStyles = derivedRelevantFilterStyles();

    private get props() {
        return this.propsFn();
    }

    constructor(private readonly propsFn: () => IFilterOptions) {

    }

    private onChange = (columnId: ColumnId, ops: Map<ColumnId, string>, setFilter: SetFilter, ev: any) => {
        Logger.debug('Filter -- onChange', columnId, ev.target.value && ev.target.value.trim());

        const value = ev.target.value.trim();

        if (value && value.length) {
            ops.set(columnId.toString(), value);
        } else {
            ops.delete(columnId.toString());
        }

        setFilter(R.map(
            ([cId, filter]) => `"${cId}" ${filter}`,
            R.filter(
                ([cId]) => this.isFragmentValid(cId),
                Array.from(ops.entries())
            )
        ).join(' && '));
    }

    private getEventHandler = (fn: Function, columnId: ColumnId, ops: Map<ColumnId, string>, setFilter: SetFilter): any => {
        const fnHandler = (this.handlers.get(fn) || this.handlers.set(fn, new Map()).get(fn));
        const columnIdHandler = (fnHandler.get(columnId) || fnHandler.set(columnId, new Map()).get(columnId));

        return (
            columnIdHandler.get(setFilter) ||
            (columnIdHandler.set(setFilter, fn.bind(this, columnId, ops, setFilter)).get(setFilter))
        );
    }

    private updateOps(query: string) {
        const ast = new MultiColumnsSyntaxTree(query);

        if (!ast.isValid) {
            return;
        }

        const statements = ast.statements;
        if (!statements) {
            this.ops.clear();
            return;
        }

        R.forEach(s => {
            if (s.lexeme.name === LexemeType.UnaryOperator && s.block) {
                this.ops.set(s.block.value, s.value);
            } else if (s.lexeme.name === LexemeType.BinaryOperator && s.left && s.right) {
                this.ops.set(s.left.value, `${s.value} ${s.right.value}`);
            }
        }, statements);
    }

    private isFragmentValidOrNull(columnId: ColumnId) {
        const op = this.ops.get(columnId.toString());

        return !op || !op.trim().length || this.isFragmentValid(columnId);
    }

    private isFragmentValid(columnId: ColumnId) {
        const op = this.ops.get(columnId.toString());

        const ast = new SingleColumnSyntaxTree(columnId, op || '');

        return ast.isValid;
    }

    public createFilters() {
        const {
            columns,
            fillerColumns,
            filtering,
            filtering_settings,
            filtering_type,
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
                return (<ColumnFilter
                    key={`column-${index}`}
                    classes={`dash-filter column-${index}`}
                    columnId={column.id}
                    isValid={this.isFragmentValidOrNull(column.id)}
                    setFilter={this.getEventHandler(this.onChange, column.id, this.ops, setFilter)}
                    value={this.ops.get(column.id.toString())}
                />);
            }, columns);

            const styledFilters = arrayMap(
                filters,
                wrapperStyles,
                    (f, s) => React.cloneElement(f, { style: s }));

            const offsets = R.range(0, fillerColumns).map(i => (<th key={`offset-${i}`} />));

            return [offsets.concat(styledFilters)];
        } else {
            return [[]];
        }
    }
}