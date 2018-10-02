import * as R from 'ramda';
import React from 'react';

import { memoizeOneFactory } from 'core/memoizer';
import Stylesheet from 'core/Stylesheet';

import { VisibleColumns } from 'dash-table/components/Table/props';

export const DEFAULT_CELL_WIDTH = 200;

function getter(
    columns: VisibleColumns,
    labelsAndIndices: R.KeyValuePair<any[], number[]>[],
    mergeHeaders: boolean,
    fixedColumns: number
): JSX.Element[][] {
    return R.map(([labels, indices]) => {
        return R.addIndex<number, JSX.Element>(R.map)(
            (columnIndex, index) => {
                const column = columns[columnIndex];

                let colSpan: number;
                if (!mergeHeaders) {
                    colSpan = 1;
                } else {
                    if (columnIndex === R.last(indices)) {
                        colSpan = labels.length - columnIndex;
                    } else {
                        colSpan = indices[index + 1] - columnIndex;
                    }
                }

                const spannedColumns = columns.filter((_column, i) =>
                    i >= columnIndex &&
                    i < columnIndex + colSpan &&
                    i < fixedColumns
                );

                // Calculate the width of all those columns combined
                const width = `calc(${spannedColumns.map(c => Stylesheet.unit(c.width || DEFAULT_CELL_WIDTH, 'px')).join(' + ')})`;
                const maxWidth = `calc(${spannedColumns.map(c => Stylesheet.unit(c.maxWidth || c.width || DEFAULT_CELL_WIDTH, 'px')).join(' + ')})`;
                const minWidth = `calc(${spannedColumns.map(c => Stylesheet.unit(c.minWidth || c.width || DEFAULT_CELL_WIDTH, 'px')).join(' + ')})`;

                return (<th
                    key={`header-cell-${columnIndex}`}
                    data-dash-column={column.id}
                    colSpan={colSpan}
                    className={
                        `dash-header ` +
                        `column-${columnIndex} ` +
                        (columnIndex === columns.length - 1 || columnIndex === R.last(indices) ? 'cell--right-last ' : '')
                    }
                    style={columnIndex < fixedColumns ? { maxWidth, minWidth, width } : undefined}
                />);
            },
            indices
        );
    },
        labelsAndIndices
    );
}

export default memoizeOneFactory(getter);
