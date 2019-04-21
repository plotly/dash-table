import { min, max, set, lensPath } from 'ramda';
import { ICellFactoryProps } from 'dash-table/components/Table/props';
import isActive from 'dash-table/derived/cell/isActive';
import isSelected from 'dash-table/derived/cell/isSelected';
import { makeCell, makeSelection } from 'dash-table/derived/cell/cellProps';
import reconcile from 'dash-table/type/reconcile';

export const handleClick = (propsFn: () => ICellFactoryProps, idx: number, i: number, e: any) => {
    const {
        selected_cells,
        start_cell,
        setProps,
        virtualized,
        columns,
        viewport
    } = propsFn();

    const selected = isSelected(selected_cells, idx, i);

    // don't update if already selected
    if (selected) {
        return;
    }

    e.preventDefault();

    const row = idx + virtualized.offset.rows;
    const col = i + virtualized.offset.columns;

    const activeCell = makeCell(row, col, columns, viewport);

    const newProps: Partial<ICellFactoryProps> = {
        is_focused: false,
        active_cell: activeCell,
        start_cell: activeCell,
        end_cell: activeCell
    };

    if (e.shiftKey && start_cell && start_cell.row !== undefined) {
        newProps.selected_cells = makeSelection(
            {
                minRow: min(row, start_cell.row),
                maxRow: max(row, start_cell.row),
                minCol: min(col, start_cell.column),
                maxCol: max(col, start_cell.column)
            },
            columns,
            viewport
        );
        delete newProps.start_cell;
        delete newProps.active_cell;

    } else {
        newProps.selected_cells = [activeCell];
    }

    /*
     * In some cases this will initiate browser text selection.
     * We've hijacked copying, so while it might be nice to allow copying part
     * of a cell, currently you'll always get the whole cell regardless of what
     * the browser thinks is selected.
     * And when you've selected multiple cells the browser selection is
     * completely wrong.
     */
    window.getSelection().removeAllRanges();

    setProps(newProps);
};

export const handleDoubleClick = (propsFn: () => ICellFactoryProps, idx: number, i: number, e: any) => {
    const {
        editable,
        is_focused,
        setProps,
        virtualized
    } = propsFn();

    if (!editable) {
        return;
    }

    const cellLocation: [number, number] = [
        idx + virtualized.offset.rows,
        i + virtualized.offset.columns
    ];

    if (!is_focused) {
        e.preventDefault();
        const newProps = {
            selected_cells: [cellLocation],
            active_cell: cellLocation,
            is_focused: true
        };
        setProps(newProps);
    }
};

export const handleChange = (propsFn: () => ICellFactoryProps, idx: number, i: number, value: any) => {
    const {
        columns,
        data,
        editable,
        setProps,
        virtualized
    } = propsFn();

    const c = columns[i];
    const realIdx = virtualized.indices[idx];

    if (!editable) {
        return;
    }

    const result = reconcile(value, c);

    if (!result.success) {
        return;
    }

    const newData = set(
        lensPath([realIdx, c.id]),
        result.value,
        data
    );
    setProps({
        data: newData
    });

};

export const handleEnter = (propsFn: () => ICellFactoryProps, idx: number, i: number) => {
    const {
        columns,
        virtualized,
        setState
    } = propsFn();

    const c = columns[i];
    const realIdx = virtualized.indices[idx];

    setState({
        tooltip: {
            id: c.id,
            row: realIdx
        }
    });
};

export const handleLeave = (propsFn: () => ICellFactoryProps, _idx: number, _i: number) => {
    const {
        setState
    } = propsFn();

    setState({ tooltip: undefined });
};

export const handleMove = (propsFn: () => ICellFactoryProps, idx: number, i: number) => {
    const {
        columns,
        virtualized,
        setState,
        tooltip
    } = propsFn();

    const c = columns[i];
    const realIdx = virtualized.indices[idx];

    if (tooltip && tooltip.id === c.id && tooltip.row === realIdx) {
        return;
    }

    setState({
        tooltip: {
            id: c.id,
            row: realIdx
        }
    });
};

export const handleOnMouseUp = (propsFn: () => ICellFactoryProps, idx: number, i: number, e: any) => {
    const {
        active_cell,
        is_focused
    } = propsFn();

    const active = isActive(active_cell, idx, i);

    if (!is_focused && active) {
        e.preventDefault();
        // We do this because mouseMove can change the selection, we don't want
        // to check for all mouse movements, for performance reasons.
        const input = e.target;
        input.setSelectionRange(0, input.value ? input.value.length : 0);
    }
};

export const handlePaste = (_propsFn: () => ICellFactoryProps, _idx: number, _i: number, e: any) => {
    e.preventDefault();
};
