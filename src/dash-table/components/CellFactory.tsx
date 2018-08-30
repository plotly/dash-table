import * as R from 'ramda';
import React from 'react';

import Cell from 'dash-table/components/Cell';
import { ICellFactoryOptions, SelectedCells } from 'dash-table/components/Table/props';
import * as actions from 'dash-table/utils/actions';

export default class CellFactory {
    private readonly handlers = new Map();

    private isCellSelected(selectedCells: SelectedCells, idx: number, i: number) {
        return R.contains([idx, i], selectedCells);
    }

    private getEventHandler(fn: Function, options: ICellFactoryOptions, idx: number, i: number): any {
        const fnHandler = (this.handlers.get(fn) || this.handlers.set(fn, new Map()).get(fn));
        const idxHandler = (fnHandler.get(idx) || fnHandler.set(idx, new Map()).get(idx));

        return (
            idxHandler.get(i) ||
            (idxHandler.set(i, fn.bind(this, options, idx, i)).get(i))
        ) as Function;
    }

    private handleClick(options: ICellFactoryOptions, idx: number, i: number, e: any) {
        const {
            columns,
            editable,
            is_focused,
            selected_cell,
            setProps
        } = options;

        const selected = this.isCellSelected(selected_cell, idx, i);

        if (!editable) {
            return;
        }
        if (!is_focused) {
            e.preventDefault();
        }

        // don't update if already selected
        if (selected) {
            return;
        }

        e.preventDefault();
        const cellLocation: [number, number] = [idx, i];
        const newProps: Partial<ICellFactoryOptions> = {
            is_focused: false,
            active_cell: cellLocation
        };

        // visible col indices
        const vci: any[] = [];
        columns.forEach((c, ci: number) => {
            if (!c.hidden) {
                vci.push(ci);
            }
        });

        const selectedRows = R.uniq(R.pluck(0, selected_cell)).sort();
        const selectedCols = R.uniq(R.pluck(1, selected_cell)).sort();
        const minRow = selectedRows[0];
        const minCol = selectedCols[0];

        if (e.shiftKey) {
            newProps.selected_cell = R.xprod(
                R.range(
                    R.min(minRow, cellLocation[0]),
                    R.max(minRow, cellLocation[0]) + 1
                ),
                R.range(
                    R.min(minCol, cellLocation[1]),
                    R.max(minCol, cellLocation[1]) + 1
                )
            ).filter(c => R.contains(c[1], vci)) as any;
        } else {
            newProps.selected_cell = [cellLocation];
        }
        setProps(newProps);
    }

    private handleDoubleClick(options: ICellFactoryOptions, idx: number, i: number, e: any) {
        const {
            editable,
            is_focused,
            setProps
        } = options;

        if (!editable) {
            return;
        }

        if (!is_focused) {
            e.preventDefault();
            const newProps = {
                selected_cell: [[idx, i]],
                active_cell: [idx, i],
                is_focused: true
            };
            setProps(newProps);
        }
    }

    private handleChange(options: ICellFactoryOptions, idx: number, i: number, e: any) {
        const {
            columns,
            dataframe,
            editable,
            setProps
        } = options;

        const c = columns[i];

        if (!editable) {
            return;
        }

        const newDataframe = R.set(
            R.lensPath([idx, c.id]),
            e.target.value,
            dataframe
        );
        setProps({
            dataframe: newDataframe
        });
    }

    private handlePaste(options: ICellFactoryOptions, idx: number, i: number, e: any) {
        const {
            is_focused,
            selected_cell
        } = options;

        const selected = this.isCellSelected(selected_cell, idx, i);

        if (!(selected && is_focused)) {
            e.preventDefault();
        }
    }

    rowSelectCell(options: ICellFactoryOptions, idx: number) {
        const {
            n_fixed_columns,
            setProps,
            selected_rows,
            row_deletable,
            row_selectable
        } = options;

        const rowSelectableFixedIndex = row_deletable ? 1 : 0;

        return !row_selectable ? null : (
            <td
                key='select'
                className={
                    'select-cell'
                    // (n_fixed_columns > rowSelectableFixedIndex ? `frozen-left frozen-left-${rowSelectableFixedIndex} ` : '')
                }
                style={n_fixed_columns > rowSelectableFixedIndex ? {
                    width: `30px`
                } : undefined}
            >
                <input
                    type={row_selectable === 'single' ? 'radio' : 'checkbox'}
                    name='row-select'
                    checked={R.contains(idx, selected_rows)}
                    onChange={() => setProps({
                        selected_rows:
                            row_selectable === 'single' ?
                                [idx] :
                                R.ifElse(
                                    R.contains(idx),
                                    R.without([idx]),
                                    R.append(idx)
                                )(selected_rows)
                    })}
                />
            </td>
        );
    }

    rowDeleteCell(options: ICellFactoryOptions, idx: number) {
        const {
            n_fixed_columns,
            setProps,
            row_deletable
        } = options;

        return !row_deletable ? null : (
            <td
                key='delete'
                className={
                    'delete-cell'
                    // (n_fixed_columns > 0 ? 'frozen-left frozen-left-0 ' : '')
                }
                onClick={() => setProps(actions.deleteRow(idx, options))}
                style={n_fixed_columns > 0 ? {
                    width: `30px`
                } : undefined}
            >
                {'×'}
            </td>
        );
    }

    public createCells(options: ICellFactoryOptions) {
        const {
            active_cell,
            columns,
            column_conditional_dropdowns,
            column_conditional_styles,
            column_static_dropdown,
            column_static_style,
            dataframe,
            editable,
            id,
            is_focused,
            row_deletable,
            row_selectable,
            selected_cell
        } = options;

        const visibleColumns = columns.filter(column => !column.hidden);

        const offset =
            (row_deletable ? 1 : 0) +
            (row_selectable ? 1 : 0);

        return dataframe.map((datum, idx) => {
            const deleteCell = this.rowDeleteCell(options, idx);
            const selectCell = this.rowSelectCell(options, idx);

            const cells = columns.map((column, i) => {
                i += offset;

                const visibleIndex = visibleColumns.indexOf(column) + offset;

                const classes = [`column-${visibleIndex}`];

                let conditionalDropdowns = column_conditional_dropdowns.find((cd: any) => cd.id === column.id);
                let staticDropdown = column_static_dropdown.find((sd: any) => sd.id === column.id);

                conditionalDropdowns = conditionalDropdowns && conditionalDropdowns.dropdowns;
                staticDropdown = staticDropdown && staticDropdown.dropdown;

                let conditionalStyles = column_conditional_styles.find((cs: any) => cs.id === column.id);
                let staticStyle = column_static_style.find((ss: any) => ss.id === column.id);

                conditionalStyles = conditionalStyles && conditionalStyles.styles;
                staticStyle = staticStyle && staticStyle.style;

                return (<Cell
                    key={`${column.id}-${i}`}
                    active={active_cell[0] === idx && active_cell[1] === i}
                    classes={classes}
                    clearable={column.clearable}
                    conditionalDropdowns={conditionalDropdowns}
                    conditionalStyles={conditionalStyles}
                    datum={datum}
                    editable={editable}
                    focused={!!is_focused}
                    onClick={this.getEventHandler(this.handleClick, options, idx, i)}
                    onDoubleClick={this.getEventHandler(this.handleDoubleClick, options, idx, i)}
                    onPaste={this.getEventHandler(this.handlePaste, options, idx, i)}
                    onChange={this.getEventHandler(this.handleChange, options, idx, i)}
                    property={column.id}
                    selected={R.contains([idx, i], selected_cell)}
                    staticDropdown={staticDropdown}
                    staticStyle={staticStyle}
                    tableId={id}
                    type={column.type}
                    value={datum[column.id]}
                />);
            });

            if (selectCell) {
                cells.unshift(selectCell);
            }

            if (deleteCell) {
                cells.unshift(deleteCell);
            }

            return cells;
        });
    }
}