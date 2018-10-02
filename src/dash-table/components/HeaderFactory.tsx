import React from 'react';
import * as R from 'ramda';

import { arrayMap } from 'core/math/arrayZipMap';
import Stylesheet from 'core/Stylesheet';
import { SortSettings } from 'core/sorting';

import {
    ControlledTableProps,
    PaginationMode,
    SetProps,
    Sorting,
    SortingType,
    VisibleColumns
} from 'dash-table/components/Table/props';

import derivedHeaderContent from 'dash-table/derived/header/content';
import derivedHeaderOperations from 'dash-table/derived/header/operations';
import { matrixMap } from 'core/math/matrixZipMap';

export const DEFAULT_CELL_WIDTH = 200;

export interface ICellOptions {
    columns: VisibleColumns;
    columnRowIndex: any;
    labels: any[];
    mergeCells?: boolean;
    n_fixed_columns: number;
    rowSorting: Sorting;
    setProps: SetProps;
    sorting_settings: SortSettings;
    sorting_type: SortingType;
    pagination_mode: PaginationMode;
}

const getColLength = (c: any) => (Array.isArray(c.name) ? c.name.length : 1);
const getColNameAt = (c: any, i: number) => (Array.isArray(c.name) ? c.name[i] : '');

export default class HeaderFactory {
    private readonly headerContent = derivedHeaderContent();
    private readonly headerOperations = derivedHeaderOperations();

    private get props() {
        return this.propsFn();
    }

    constructor(private readonly propsFn: () => ControlledTableProps) {

    }

    private createHeaderCells(options: ICellOptions) {
        const {
            columns,
            // columnRowIndex,
            labels,
            mergeCells,
            n_fixed_columns
            // pagination_mode,
            // rowSorting
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
                if (label === labels[compareIndex]) {
                    return;
                }
                columnIndices.push(i);
                compareIndex = i;
            });
        }

        return R.filter(column => !!column, columnIndices.map((columnId, spanId) => {
            const c = columns[columnId];

            const visibleIndex = columns.indexOf(c);

            let colSpan: number;
            if (!mergeCells) {
                colSpan = 1;
            } else {
                if (columnId === R.last(columnIndices)) {
                    colSpan = labels.length - columnId;
                } else {
                    colSpan = columnIndices[spanId + 1] - columnId;
                }
            }

            // This is not efficient and can be improved upon...
            // Fixed columns need to override the default cell behavior when they span multiple columns
            // Find all columns that fit the header's range [index, index+colspan[ and keep the fixed/visible ones
            const visibleColumnId = columns.indexOf(c);

            const spannedColumns = columns.filter((_column, index) =>
                index >= visibleColumnId &&
                index < visibleColumnId + colSpan &&
                index < n_fixed_columns
            );

            // Calculate the width of all those columns combined
            const width = `calc(${spannedColumns.map(column => Stylesheet.unit(column.width || DEFAULT_CELL_WIDTH, 'px')).join(' + ')})`;
            const maxWidth = `calc(${spannedColumns.map(column => Stylesheet.unit(column.maxWidth || column.width || DEFAULT_CELL_WIDTH, 'px')).join(' + ')})`;
            const minWidth = `calc(${spannedColumns.map(column => Stylesheet.unit(column.minWidth || column.width || DEFAULT_CELL_WIDTH, 'px')).join(' + ')})`;

            return (<th
                key={`header-cell-${columnId}`}
                data-dash-column={c.id}
                colSpan={colSpan}
                className={
                    `dash-header ` +
                    `column-${columnId} ` +
                    (columnId === columns.length - 1 || columnId === R.last(columnIndices) ? 'cell--right-last ' : '')
                }
                style={visibleIndex < n_fixed_columns ? { maxWidth, minWidth, width } : undefined}
            />);
        }));
    }

    public createHeaders() {
        const props = this.props;

        let {
            columns,
            sorting,
            merge_duplicate_headers,
            n_fixed_columns,
            pagination_mode,
            row_deletable,
            row_selectable,
            setProps,
            sorting_settings,
            sorting_type
        } = props;

        const offset =
            (row_deletable ? 1 : 0) +
            (row_selectable ? 1 : 0);

        n_fixed_columns = Math.max(0, n_fixed_columns - offset);

        const headerDepth = Math.max.apply(Math, columns.map(getColLength));

        const operations = this.headerOperations(
            headerDepth,
            row_selectable,
            row_deletable
        );

        const content = this.headerContent(
            headerDepth,
            columns,
            merge_duplicate_headers,
            sorting_type,
            sorting_settings,
            pagination_mode,
            setProps,
            props
        );

        let headers: JSX.Element[][];
        if (headerDepth === 1) {
            headers = [this.createHeaderCells({
                columns,
                columnRowIndex: 0,
                labels: R.pluck('name', columns),
                n_fixed_columns,
                pagination_mode,
                rowSorting: sorting,
                setProps,
                sorting_settings,
                sorting_type
            })];
        } else {
            headers = R.range(0, headerDepth).map(i => this.createHeaderCells({
                columns,
                columnRowIndex: i,
                labels: columns.map(
                    c =>
                        R.isNil(c.name) && i === headerDepth - 1
                            ? c.id
                            : getColNameAt(c, i)
                ),
                n_fixed_columns,
                pagination_mode,
                rowSorting: !!sorting && i + 1 === headerDepth,
                mergeCells:
                    merge_duplicate_headers &&
                    i + 1 !== headerDepth,
                setProps,
                sorting_settings,
                sorting_type
            }));
        }

        headers = matrixMap(headers, content, (h, c) => React.cloneElement(h, { children: [c] }));

        return arrayMap(operations, headers, (o, h) => Array.prototype.concat(o, h));
    }
}