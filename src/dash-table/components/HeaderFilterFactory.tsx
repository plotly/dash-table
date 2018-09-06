import * as R from 'ramda';
import React from 'react';

import Logger from 'core/Logger';

import { ColumnId, Columns, Filtering, FilteringType, IColumn } from 'dash-table/components/Table/props';
import memoizerCache from 'core/memoizerCache';
import { ColumnFilter, AdvancedFilter } from 'dash-table/components/Filter';

type SetFilter = (filter: string) => void;

export interface IFilterOptions {
    columns: Columns;
    filtering: Filtering;
    filtering_type: FilteringType;
    id: string;
    offset: number;
    setFilter: SetFilter;
}

export default class HeaderFilterFactory {
    private static readonly cache = memoizerCache<
        [string],
        [],
        Map<ColumnId, string>
        >(() => new Map<ColumnId, string>());

    private static getCache(id: string) {
        return HeaderFilterFactory.cache([id], []);
    }

    private static onChange = (id: string, columnId: ColumnId, setFilter: SetFilter, ev: any) => {
        Logger.debug('Filter -- onChange', columnId, ev.target.value && ev.target.value.trim());

        const cache = HeaderFilterFactory.getCache(id);

        cache.set(columnId, ev.target.value);

        const filter_settings = R.join(' && ')(
            R.map(
                ([cId, filter]) => `${cId} ${filter}`,
                R.filter(
                    ([, filter]) => !!filter,
                    Array.from(cache.entries())
                )
            )
        );
        setFilter(filter_settings);
    }

    private static readonly handlers = new Map();
    private static getEventHandler = (fn: Function, id: string, columnId: ColumnId, setFilter: SetFilter): any => {
        const fnHandler = (HeaderFilterFactory.handlers.get(fn) || HeaderFilterFactory.handlers.set(fn, new Map()).get(fn));
        const idHandler = (fnHandler.get(id) || fnHandler.set(id, new Map()).get(id));
        const columnIdHandler = (idHandler.get(columnId) || idHandler.set(columnId, new Map()).get(columnId));

        return (
            columnIdHandler.get(setFilter) ||
            (columnIdHandler.set(setFilter, fn.bind(HeaderFilterFactory, id, columnId, setFilter)).get(setFilter))
        );
    }

    public static createFilters(options: IFilterOptions) {
        const {
            columns,
            filtering,
            filtering_type,
            id,
            offset,
            setFilter
        } = options;

        if (!filtering) {
            return [];
        }

        const visibleColumns = R.filter(column => !column.hidden, columns);

        const offsetCells = R.range(0, offset).map(i => (<th key={`offset-${i}`} />));

        const filterCells = filtering_type === 'basic' ?
            R.addIndex<IColumn, JSX.Element>(R.map)((column, index) => {
                return (<ColumnFilter
                    key={`column-${index + offset}`}
                    classes={[`column-${index + offset}`]}
                    property={column.id}
                    setFilter={this.getEventHandler(this.onChange, id, column.id, setFilter)}
                    value={this.getCache(id).get(column.id)}
                />);
            }, visibleColumns) :
            [(<AdvancedFilter
                key={`column-${offset}`}
                classes={[]}
                colSpan={visibleColumns.length}
                value=''
                setFilter={() => undefined}
            />)];

        return [R.concat(offsetCells, filterCells)];
    }
}