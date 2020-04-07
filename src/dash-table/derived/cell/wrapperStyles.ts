import * as R from 'ramda';
import { CSSProperties } from 'react';

import { memoizeOneFactory } from 'core/memoizer';
import { Data, Columns, IViewportOffset, SelectedCells, ICellCoordinates } from 'dash-table/components/Table/props';
import { IConvertedStyle, getDataCellStyle, getDataOpCellStyle } from '../style';
import { traverseMap2, shallowClone } from 'core/math/matrixZipMap';

import isActiveCell from 'dash-table/derived/cell/isActive';

const SELECTED_CELL_STYLE = { backgroundColor: 'var(--selected-background)' };

const partialGetter = (
    columns: Columns,
    styles: IConvertedStyle[],
    data: Data,
    offset: IViewportOffset
) => traverseMap2(
    data,
    columns,
    (datum, column, i) => getDataCellStyle(datum, i + offset.rows, column, false, false)(styles)
);

const getter = (
    baseline: CSSProperties[][],
    columns: Columns,
    styles: IConvertedStyle[],
    data: Data,
    offset: IViewportOffset,
    activeCell: ICellCoordinates,
    selectedCells: SelectedCells
) => {
    baseline = shallowClone(baseline);

    const cells = selectedCells.length ?
        selectedCells :
        activeCell ? [activeCell] : [];

    R.forEach(({ row: i, column: j }) => {
        const iNoOffset = i - offset.rows;
        const jNoOffset = j - offset.columns;

        if (iNoOffset < 0 || jNoOffset < 0 || baseline.length <= iNoOffset || baseline[iNoOffset].length <= jNoOffset) {
            return;
        }

        const active = isActiveCell(activeCell, i, j);

        const style = {
            ...SELECTED_CELL_STYLE,
            ...getDataCellStyle(data[i], i + offset.rows, columns[j], active, true)(styles)
        };

        baseline[iNoOffset][jNoOffset] = style;
    }, cells);

    return baseline;
};

const opGetter = (
    columns: number,
    styles: IConvertedStyle[],
    data: Data,
    offset: IViewportOffset
) => traverseMap2(
    data,
    R.range(0, columns),
    (datum, _, i) => getDataOpCellStyle(datum, i + offset.rows)(styles)
);

export const derivedPartialDataStyles = memoizeOneFactory(partialGetter);
export const derivedDataStyles = memoizeOneFactory(getter);
export const derivedDataOpStyles = memoizeOneFactory(opGetter);