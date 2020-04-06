import * as R from 'ramda';

import Environment from 'core/environment';
import { memoizeOneFactory } from 'core/memoizer';

import {
    IViewportOffset,
    Columns,
    Data,
    ICellCoordinates,
    SelectedCells
} from 'dash-table/components/Table/props';

import isActiveCell from 'dash-table/derived/cell/isActive';

import { IConvertedStyle } from '../style';
import { EdgesMatrices, BorderStyle } from './type';
import { getDataCellEdges } from '.';
import { traverse2 } from 'core/math/matrixZipMap';

const partialGetter = (
    columns: Columns,
    styles: IConvertedStyle[],
    data: Data,
    offset: IViewportOffset,
    listViewStyle: boolean
) => {
    if (data.length === 0 || columns.length === 0) {
        return;
    }

    const edges = new EdgesMatrices(data.length, columns.length, Environment.defaultEdge, true, !listViewStyle);

    traverse2(
        data,
        columns,
        (datum, column, i, j) => edges.setEdges(i, j, getDataCellEdges(
            datum,
            i + offset.rows,
            column,
            false,
            false
        )(styles))
    );

    return edges;
}

const getter = (
    baseline: EdgesMatrices | undefined,
    columns: Columns,
    styles: IConvertedStyle[],
    data: Data,
    offset: IViewportOffset,
    activeCell: ICellCoordinates | undefined,
    selectedCells: SelectedCells
) => {
    if (!baseline) {
        return baseline;
    }

    const edges = baseline.clone();

    R.forEach(({ row: i, column: j }) => {
        const active = isActiveCell(activeCell, i, j);
        const priority = active ? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER - 1;

        const style: BorderStyle = {
            borderBottom: [Environment.activeEdge, priority],
            borderLeft: [Environment.activeEdge, priority],
            borderRight: [Environment.activeEdge, priority],
            borderTop: [Environment.activeEdge, priority],
            ...getDataCellEdges(
                data[i][j],
                i + offset.rows,
                columns[j],
                active,
                true,
                priority
            )(styles)
        };

        edges.setEdges(i, j, style);
    }, selectedCells);

    return edges;
}

export const derivedPartialDataEdges = memoizeOneFactory(partialGetter);
export const derivedDataEdges = memoizeOneFactory(getter);