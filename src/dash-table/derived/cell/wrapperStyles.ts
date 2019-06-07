import * as R from 'ramda';

import { memoizeOneFactory } from 'core/memoizer';
import { Data, VisibleColumns, IViewportOffset, SelectedCells, ICellCoordinates } from 'dash-table/components/Table/props';
import { IConvertedStyle } from '../style';
import { getDataCellStyle, getDataOpCellStyle } from '../edges';
import { traverseMap2 } from 'core/math/matrixZipMap';

const isSelected = (
    i: number,
    j: number,
    cells: ICellCoordinates[]
) => R.any(cell => cell.row === i && cell.column === j, cells);

const SELECTED_CELL_STYLE = { backgroundColor: 'var(--selected-background)' };

const getter = (
    columns: VisibleColumns,
    styles: IConvertedStyle[],
    data: Data,
    offset: IViewportOffset,
    selectedCells: SelectedCells
) => traverseMap2(
    data,
    columns,
    (datum, column, i, j) => R.merge(
        getDataCellStyle(datum, i + offset.rows, column)(styles),
        isSelected(i, j, selectedCells) ? SELECTED_CELL_STYLE : {}
    )
);

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

export default memoizeOneFactory(getter);
export const derivedDataOpStyles = memoizeOneFactory(opGetter);