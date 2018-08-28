import React from 'react';
import * as R from 'ramda';

import Stylesheet from 'core/Stylesheet';
import { updateSettings, ISortSetting, SortDirection } from 'core/sorting';

import * as actions from 'dash-table/utils/actions';
import { DEFAULT_CELL_WIDTH } from 'dash-table/components/Row';

interface ICellOptions {
    columns: any[];
    columnRowIndex: any;
    dataframe: any;
    labels: any[];
    mergeCells?: boolean;
    n_fixed_columns: number;
    row_deletable: boolean;
    row_selectable: boolean;
    rowSorting: string | boolean;
    setProps: (...args: any[]) => any;
    sorting_settings: any;
    virtualization: any;
}

interface IOptions extends ICellOptions {
    merge_duplicate_headers: boolean;
    n_fixed_rows: number;
    sorting: string | boolean;
}

const getColLength = (c: any) => (Array.isArray(c.name) ? c.name.length : 1);
const getColNameAt = (c: any, i: number) => (Array.isArray(c.name) ? c.name[i] : '');

function editColumnName(column: any, columnRowIndex: any, options: ICellOptions) {
    return () => {
        const { setProps } = options;
        setProps(actions.editColumnName(column, columnRowIndex, options));
    };
}

function deleteColumn(column: any, columnRowIndex: any, options: ICellOptions) {
    return () => {
        const { setProps } = options;
        setProps(actions.deleteColumn(column, columnRowIndex, options));
    };
}

function doSort(columnId: any, options: ICellOptions) {
    return () => {
        const sorting_settings = updateSettings(options.sorting_settings, columnId);

        options.setProps({ sorting_settings });
    };
}

export default class HeaderFactory {
    private static createHeaderCells(options: ICellOptions) {
        const {
            columns,
            columnRowIndex,
            labels,
            mergeCells,
            n_fixed_columns,
            row_deletable,
            row_selectable,
            rowSorting,
            sorting_settings,
            virtualization
        } = options;

        let columnIndices: any[] = [];

        if (!mergeCells) {
            columnIndices = R.range(0, columns.length);
        } else {
            columnIndices = [0];
            let compareIndex = 0;
            labels.forEach((label, i) => {
                // Skip over hidden columns for labels selection / filtering;
                // otherwise they will be filtered out when generating the headers
                if (columns[i].hidden || label === labels[compareIndex]) {
                    return;
                }
                columnIndices.push(i);
                compareIndex = i;
            });
        }

        const visibleColumns = columns.filter(column => !column.hidden);

        const columnIndexOffset =
            (row_deletable ? 1 : 0) +
            (row_selectable ? 1 : 0);

        const getSortingIcon = (columnId: string | number) => {
            const setting = R.find((s: ISortSetting) => s.columnId === columnId, sorting_settings);

            if (!setting) {
                return '↕';
            }

            return setting.direction === SortDirection.Descending ? '↑' : '↓';
        };

        return columnIndices.map((columnId, spanId) => {
            const c = columns[columnId];
            if (c.hidden) {
                return null;
            }

            const visibleIndex = visibleColumns.indexOf(c) + columnIndexOffset;

            let colSpan: number;
            if (!mergeCells) {
                colSpan = 1;
            } else {
                const nHiddenColumns = (
                    R.slice(columnId, columnIndices[spanId + 1] || Infinity, columns)
                     .filter(R.propEq('hidden', true))
                     .length);
                if (columnId === R.last(columnIndices)) {
                    colSpan = labels.length - columnId - nHiddenColumns;
                } else {
                    colSpan = columnIndices[spanId + 1] - columnId - nHiddenColumns;
                }
            }

            // This is not efficient and can be improved upon...
            // Fixed columns need to override the default cell behavior when they span multiple columns
            // Find all columns that fit the header's range [index, index+colspan[ and keep the fixed/visible ones
            const visibleColumnId = visibleColumns.indexOf(c);

            const spannedColumns = visibleColumns.filter((column, index) =>
                !column.hidden &&
                index >= visibleColumnId &&
                index < visibleColumnId + colSpan &&
                index + columnIndexOffset < n_fixed_columns
            );

            // Calculate the width of all those columns combined
            const width = `calc(${spannedColumns.map(column => Stylesheet.unit(column.width || DEFAULT_CELL_WIDTH, 'px')).join(' + ')})`;

            return (<th
                key={`header-cell-${columnId}`}
                colSpan={colSpan}
                className={
                    (columnId === columns.length - 1 || columnId === R.last(columnIndices) ? 'cell--right-last ' : '') +
                    (visibleIndex < n_fixed_columns ? `frozen-left frozen-left-${visibleIndex}` : '')

                }
                style={visibleIndex < n_fixed_columns ? {
                    maxWidth: width,
                    minWidth: width,
                    width: width
                } : undefined}
            >
                {rowSorting ? (
                    <span
                        className='filter'
                        onClick={doSort(c.id, options)}
                    >
                        {getSortingIcon(c.id)}
                    </span>) : ('')
                }

                {((c.editable_name && R.type(c.editable_name) === 'Boolean') ||
                    (R.type(c.editable_name) === 'Number' &&
                        c.editable_name === columnRowIndex)) ? (
                        <span
                            className='column-header--edit'
                            onClick={editColumnName(c, columnRowIndex, options)}
                        >
                            {`✎`}
                        </span>
                    ) : ''}

                {((c.deletable && virtualization !== 'be' && R.type(c.deletable) === 'Boolean') ||
                    (R.type(c.deletable) === 'Number' &&
                        c.deletable === columnRowIndex)) ? (
                        <span
                            className='column-header--delete'
                            onClick={deleteColumn(
                                c, columnRowIndex, options)}
                        >
                            {'×'}
                        </span>
                    ) : ''}

                <span>{labels[columnId]}</span>
            </th>);
        });
    }

    private static createDeletableHeader(options: IOptions) {
        const { n_fixed_columns, row_deletable } = options;
        return !row_deletable ? null : (
            <th
                className={
                    'expanded-row--empty-cell ' +
                    (n_fixed_columns > 0 ? 'frozen-left frozen-left-0' : '')
                }
                style={n_fixed_columns > 0 ? { width: `30px` } : undefined}

            />
        );
    }

    private static createSelectableHeader(options: IOptions) {
        const { n_fixed_columns, row_deletable, row_selectable } = options;

        const rowSelectableFixedIndex = row_deletable ? 1 : 0;

        return !row_selectable ? null : (
            <th
                className={
                    'expanded-row--empty-cell ' +
                    (n_fixed_columns > rowSelectableFixedIndex ? `frozen-left frozen-left-${rowSelectableFixedIndex}` : '')
                }
                style={n_fixed_columns > rowSelectableFixedIndex ? { width: `30px` } : undefined}
            />
        );
    }

    static createHeaders(options: IOptions) {
        let {
            columns,
            dataframe,
            sorting,
            merge_duplicate_headers,
            n_fixed_columns,
            row_deletable,
            row_selectable,
            setProps,
            sorting_settings,
            virtualization
        } = options;

        const deletableCell = this.createDeletableHeader(options);
        const selectableCell = this.createSelectableHeader(options);

        const headerDepth = Math.max.apply(Math, columns.map(getColLength));

        if (headerDepth === 1) {
            return [(
                <tr key={`header-0`}>
                    {selectableCell}
                    {HeaderFactory.createHeaderCells({
                        columns,
                        columnRowIndex: 0,
                        dataframe,
                        labels: R.pluck('name', columns),
                        n_fixed_columns,
                        row_deletable,
                        row_selectable,
                        rowSorting: sorting,
                        setProps,
                        sorting_settings,
                        virtualization
                    })}
                </tr>
            )];
        } else {
            return R.range(0, headerDepth).map(i => (
                <tr key={`header-${i}`}>
                    {deletableCell}
                    {selectableCell}
                    {HeaderFactory.createHeaderCells({
                        columns,
                        columnRowIndex: i,
                        dataframe,
                        labels: columns.map(
                            c =>
                                R.isNil(c.name) && i === headerDepth - 1
                                    ? c.id
                                    : getColNameAt(c, i)
                        ),
                        n_fixed_columns,
                        row_deletable,
                        row_selectable,
                        rowSorting: !!sorting && i + 1 === headerDepth,
                        mergeCells:
                            merge_duplicate_headers &&
                            i + 1 !== headerDepth,
                        setProps,
                        sorting_settings,
                        virtualization
                    })}
                </tr>
            ));
        }
    }
}