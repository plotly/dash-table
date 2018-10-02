import * as R from 'ramda';
import React from 'react';

import { memoizeOneFactory } from 'core/memoizer';
import { SortDirection, SortSettings } from 'core/sorting';
import multiUpdateSettings from 'core/sorting/multi';
import singleUpdateSettings from 'core/sorting/single';

import {
    ColumnId,
    PaginationMode,
    SortingType,
    VisibleColumns,
    IVisibleColumn,
    SetProps,
    ControlledTableProps
} from 'dash-table/components/Table/props';
import * as actions from 'dash-table/utils/actions';

const getColNameAt = (c: any, i: number) => (Array.isArray(c.name) ? c.name[i] : '');

function deleteColumn(column: IVisibleColumn, columns: VisibleColumns, columnRowIndex: any, setProps: SetProps, options: ControlledTableProps) {
    return () => {
        setProps(actions.deleteColumn(column, columns, columnRowIndex, options));
    };
}

function doSort(columnId: ColumnId, sortSettings: SortSettings, sortType: SortingType, setProps: SetProps) {
    return () => {
        let direction: SortDirection;
        switch (getSorting(columnId, sortSettings)) {
            case SortDirection.Descending:
                direction = SortDirection.Ascending;
                break;
            case SortDirection.Ascending:
                direction = SortDirection.None;
                break;
            case SortDirection.None:
            default:
                direction = SortDirection.Descending;
                break;
        }

        const sortingStrategy = sortType === 'single' ?
            singleUpdateSettings :
            multiUpdateSettings;

        setProps({
            sorting_settings: sortingStrategy(
                sortSettings,
                { columnId, direction }
            )
        });
    };
}

function editColumnName(column: IVisibleColumn, columns: VisibleColumns, columnRowIndex: any, setProps: SetProps, options: ControlledTableProps) {
    return () => {
        setProps(actions.editColumnName(column, columns, columnRowIndex, options));
    };
}

function getSorting(columnId: ColumnId, settings: SortSettings): SortDirection {
    const setting = R.find(s => s.columnId === columnId, settings);

    return setting ? setting.direction : SortDirection.None;
}

function getSortingIcon(columnId: ColumnId, sortSettings: SortSettings) {
    switch (getSorting(columnId, sortSettings)) {
        case SortDirection.Descending:
            return '↑';
        case SortDirection.Ascending:
            return '↓';
        case SortDirection.None:
        default:
            return '↕';
    }
}

function getter(
    headerRows: number,
    columns: VisibleColumns,
    mergeHeaders: boolean,
    sortType: SortingType,
    sortSettings: SortSettings,
    paginationMode: PaginationMode,
    setProps: SetProps,
    options: ControlledTableProps
): JSX.Element[][] {
    return R.map(
        headerRowIndex => {
            const labels = columns.map(
                c =>
                    R.isNil(c.name) && headerRowIndex === headerRows - 1
                        ? c.id
                        : getColNameAt(c, headerRowIndex)
            );

            let columnIndices: any[];
            if (!mergeHeaders) {
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

            return R.addIndex<number, JSX.Element>(R.map)(
                columnIndex => {
                    const column = columns[columnIndex];
                    return (<div>
                        {sortType ?
                            (<span
                                className='sort'
                                onClick={doSort(column.id, sortSettings, sortType, setProps)}
                            >
                                {getSortingIcon(column.id, sortSettings)}
                            </span>) :
                            ''
                        }

                        {(column.editable_name && R.type(column.editable_name) === 'Boolean') ?
                            (<span
                                className='column-header--edit'
                                onClick={editColumnName(column, columns, headerRowIndex, setProps, options)}
                            >
                                {`✎`}
                            </span>) :
                            ''
                        }

                        {(column.deletable && paginationMode !== 'be' && R.type(column.deletable) === 'Boolean') ?
                            (<span
                                className='column-header--delete'
                                onClick={deleteColumn(column, columns, headerRowIndex, setProps, options)}
                            >
                                {'×'}
                            </span>) :
                            ''
                        }

                        <span>{labels[columnIndex]}</span>
                    </div>);
                },
                columnIndices
            );
        },
        R.range(0, headerRows)
    );
}

export default memoizeOneFactory(getter);
