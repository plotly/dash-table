import * as R from 'ramda';

import Logger from 'core/Logger';

import { ActiveCell, Columns, Data, ColumnType, ValidationFailure } from 'dash-table/components/Table/props';
import coerce, { ICoerceResult } from 'dash-table/type/coerce';
import isEditable from 'dash-table/derived/cell/isEditable';

export default (
    values: string[][],
    activeCell: ActiveCell,
    derived_viewport_indices: number[],
    columns: Columns,
    data: Data,
    overflowColumns: boolean = true,
    overflowRows: boolean = true
): { data: Data, columns: Columns } | void => {
    if (!overflowRows) {
        Logger.debug(`Clipboard -- Sorting or filtering active, do not create new rows`);
    }

    if (!overflowColumns) {
        Logger.debug(`Clipboard -- Do not create new columns`);
    }

    // don't modify the data and columns directly -- we may abort the paste
    let newData = R.clone(data);
    const newColumns = R.clone(columns);

    if (overflowColumns && values[0].length + (activeCell as any)[1] >= columns.length) {
        for (
            let i = columns.length;
            i < values[0].length + (activeCell as any)[1];
            i++
        ) {
            newColumns.push({
                id: `Column ${i + 1}`,
                name: `Column ${i + 1}`,
                type: ColumnType.Any
            });
            newData.forEach(row => (row[`Column ${i}`] = ''));
        }
    }

    const realActiveRow = derived_viewport_indices[(activeCell as any)[0]];
    if (overflowRows && values.length + realActiveRow >= data.length) {
        const emptyRow: any = {};
        columns.forEach(c => (emptyRow[c.id] = ''));
        newData = R.concat(
            newData,
            R.repeat(
                emptyRow,
                values.length + realActiveRow - data.length
            )
        );
    }

    const lastEntry = derived_viewport_indices.slice(-1)[0] || 0;
    const viewportSize = derived_viewport_indices.length;

    // coerce & reconcile all values -> matrix
    const coercedValues = values.map((row: string[], i: number) =>
        row.map((cell: string, j: number) => {
            const viewportIndex = (activeCell as any)[0] + i;

            let iRealCell: number | undefined = viewportSize > viewportIndex ?
                derived_viewport_indices[viewportIndex] :
                overflowRows ?
                    lastEntry + (viewportIndex - viewportSize + 1) :
                    undefined;

            if (iRealCell === undefined) {
                return;
            }

            const jOffset = (activeCell as any)[1] + j;
            const col = newColumns[jOffset];

            return coerce(cell, col);
        })
    );

    const flattenValues = R.unnest(coercedValues);

    const prevent: boolean = R.any(v => Boolean(v && v.action === ValidationFailure.Prevent), flattenValues);
    if (prevent) {
        return;
    }

    // matrix -> apply values
    coercedValues.forEach((row: (ICoerceResult | undefined)[], i: number) =>
        row.forEach((result: ICoerceResult | undefined, j: number) => {
            const viewportIndex = (activeCell as any)[0] + i;

            let iRealCell: number | undefined = viewportSize > viewportIndex ?
                derived_viewport_indices[viewportIndex] :
                overflowRows ?
                    lastEntry + (viewportIndex - viewportSize + 1) :
                    undefined;

            if (iRealCell === undefined) {
                return;
            }

            const jOffset = (activeCell as any)[1] + j;
            const col = newColumns[jOffset];

            if (col && isEditable(true, col.editable) && result && result.success) {
                newData = R.set(
                    R.lensPath([iRealCell, col.id]),
                    result.value,
                    newData
                );
            }
        })
    );

    return { data: newData, columns: newColumns };
};