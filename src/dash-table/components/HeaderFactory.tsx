import React from 'react';
import * as R from 'ramda';
import * as actions from '../utils/actions';

import { DEFAULT_CELL_WIDTH } from './Cell';

interface ICellOptions {
    columns: any[];
    columnRowIndex: any;
    dataframe: any;
    labels: any[];
    mergeCells?: boolean;
    n_fixed_columns: number;
    rowIsSortable: boolean;
    setProps: (...args: any[]) => any;
    sort: any;
    virtualization: any;
}

interface IOptions extends ICellOptions {
    merge_duplicate_headers: boolean;
    n_fixed_rows: number;
    row_deletable: boolean;
    row_selectable: boolean;
    sortable: boolean;
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

export default class HeaderFactory {
    private static createHeaderCells(options: ICellOptions, indexOffset: number) {
        const {
            columns,
            columnRowIndex,
            labels,
            mergeCells,
            n_fixed_columns,
            rowIsSortable,
            sort,
            virtualization
        } = options;

        let columnIndices: any[] = [];

        if (!mergeCells) {
            columnIndices = R.range(0, columns.length);
        } else {
            columnIndices = [0];
            let compareIndex = 0;
            labels.forEach((label, i) => {
                if (label === labels[compareIndex]) {
                    return;
                }
                columnIndices.push(i);
                compareIndex = i;
            });
        }

        return columnIndices.map((i, j) => {
            const c = columns[i];
            if (c.hidden) {
                return null;
            }

            let colSpan;
            if (!mergeCells) {
                colSpan = 1;
            } else {
                const nHiddenColumns = (
                    R.slice(i, columnIndices[j + 1] || Infinity, columns)
                     .filter(R.propEq('hidden', true))
                     .length);
                if (i === R.last(columnIndices)) {
                    colSpan = labels.length - i - nHiddenColumns;
                } else {
                    colSpan = columnIndices[j + 1] - i - nHiddenColumns;
                }
            }
            return (
                <th
                    key={`header-cell-${i}`}
                    colSpan={colSpan}
                    className={
                        (i === columns.length - 1 || i === R.last(columnIndices) ? 'cell--right-last ' : '') +
                        (i + indexOffset < n_fixed_columns ? `frozen-left frozen-left-${i + indexOffset}` : '')

                    }
                    style={i + indexOffset < n_fixed_columns ? {
                        width: `${c.width || DEFAULT_CELL_WIDTH}px`
                    } : {}}
                >
                    {rowIsSortable ? (
                        <span
                            className='filter'
                            onClick={() => sort(c.id)}
                        >
                            {R.find(R.propEq('column', c.id), sort)
                                ? R.find(R.propEq('column', c.id), sort)
                                    .direction === 'desc'
                                    ? '↑'
                                    : '↓'
                                : '↕'}
                        </span>) : ('')
                    }

                    {((c.editable_name && R.type(c.editable_name) === 'Boolean') ||
                        (R.type(c.editable_name) === 'Number' &&
                            c.editable_name === i)) ? (
                            <span
                                className='column-header--edit'
                                onClick={editColumnName(c, columnRowIndex, options)}
                            >
                                {`✎`}
                            </span>
                        ) : ''}

                    {((c.deletable && virtualization !== 'be' && R.type(c.deletable) === 'Boolean') ||
                        (R.type(c.deletable) === 'Number' &&
                            c.deletable === i)) ? (
                            <span
                                className='column-header--delete'
                                onClick={deleteColumn(
                                    c, columnRowIndex, options)}
                            >
                                {'×'}
                            </span>
                        ) : ''}

                    <span>{labels[i]}</span>
                </th>
            );
        });
    }

    static createHeaders(options: IOptions) {
        let {
            columns,
            dataframe,
            sortable,
            merge_duplicate_headers,
            n_fixed_columns,
            row_deletable,
            row_selectable,
            setProps,
            sort,
            virtualization
        } = options;

        const deletableCell = !row_deletable ? null : (
            <th
                className={
                    'expanded-row--empty-cell ' +
                    (n_fixed_columns > 0 ? 'frozen-left frozen-left-0' : '')
                }
                style={n_fixed_columns > 0 ? { width: `30px` } : {}}

            />
        );

        const rowSelectableFixedIndex = row_deletable ? 1 : 0;

        const selectableCell = !row_selectable ? null : (
            <th
                className={
                    'expanded-row--empty-cell ' +
                    (n_fixed_columns > rowSelectableFixedIndex ? `frozen-left frozen-left-${rowSelectableFixedIndex}` : '')
                }
                style={n_fixed_columns > rowSelectableFixedIndex ? { width: `30px` } : {}}
            />
        );

        const headerDepth = Math.max.apply(Math, columns.map(getColLength));
        const indexOffset =
            (row_deletable ? 1 : 0) +
            (row_selectable ? 1 : 0);

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
                        rowIsSortable: sortable,
                        setProps,
                        sort,
                        virtualization
                    }, indexOffset)}
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
                        rowIsSortable: sortable && i + 1 === headerDepth,
                        mergeCells:
                            merge_duplicate_headers &&
                            i + 1 !== headerDepth,
                        setProps,
                        sort,
                        virtualization
                    }, indexOffset)}
                </tr>
            ));
        }
    }
}