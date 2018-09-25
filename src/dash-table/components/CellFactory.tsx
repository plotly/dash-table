import * as R from 'ramda';
import React, { ClipboardEvent } from 'react';

import Cell from 'dash-table/components/Cell';
import { ICellFactoryOptions, SelectedCells } from 'dash-table/components/Table/props';
import * as actions from 'dash-table/utils/actions';

export default class CellFactory {
    private readonly handlers = new Map();

    private get props() {
        return this.propsFn();
    }

    constructor(private readonly propsFn: () => ICellFactoryOptions) {

    }

    private isCellSelected = (selectedCells: SelectedCells, idx: number, i: number) => {
        return selectedCells && R.contains([idx, i], selectedCells);
    }

    private getEventHandler = (fn: Function, idx: number, i: number): any => {
        const fnHandler = (this.handlers.get(fn) || this.handlers.set(fn, new Map()).get(fn));
        const idxHandler = (fnHandler.get(idx) || fnHandler.set(idx, new Map()).get(idx));

        return (
            idxHandler.get(i) ||
            (idxHandler.set(i, fn.bind(this, idx, i)).get(i))
        );
    }

    private handleClick = (idx: number, i: number, e: any) => {
        const {
            editable,
            is_focused,
            selected_cell,
            setProps
        } = this.props;

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

        const selectedRows = R.uniq(R.pluck(0, selected_cell)).sort((a, b) => a - b);
        const selectedCols = R.uniq(R.pluck(1, selected_cell)).sort((a, b) => a - b);
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
            ) as any;
        } else {
            newProps.selected_cell = [cellLocation];
        }

        setProps(newProps);
    }

    private handleDoubleClick = (idx: number, i: number, e: any) => {
        const {
            editable,
            is_focused,
            setProps
        } = this.props;

        if (!editable) {
            return;
        }

        const cellLocation: [number, number] = [idx, i];

        if (!is_focused) {
            e.preventDefault();
            const newProps = {
                selected_cell: [cellLocation],
                active_cell: cellLocation,
                is_focused: true
            };
            setProps(newProps);
        }
    }

    private handleChange = (idx: number, i: number, value: any) => {
        const {
            columns,
            dataframe,
            editable,
            setProps
        } = this.props;

        const c = columns[i];

        if (!editable) {
            return;
        }

        const newDataframe = R.set(
            R.lensPath([idx, c.id]),
            value,
            dataframe
        );
        setProps({
            dataframe: newDataframe
        });
    }

    private handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
    }

    private rowSelectCell(idx: number) {
        const {
            setProps,
            selected_rows,
            row_selectable
        } = this.props;

        return !row_selectable ? null : (<td
            key='select'
            className='dash-select-cell'
            style={{ width: `30px`, maxWidth: `30px`, minWidth: `30px` }}
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
        </td>);
    }

    private rowDeleteCell(idx: number) {
        const {
            setProps,
            row_deletable
        } = this.props;

        return !row_deletable ? null : (<td
            key='delete'
            className='dash-delete-cell'
            onClick={() => setProps(actions.deleteRow(idx, this.props))}
            style={{ width: `30px`, maxWidth: `30px`, minWidth: `30px` }}
        >
            {'×'}
        </td>);
    }

    public createCells() {
        const {
            active_cell,
            columns,
            column_conditional_dropdowns,
            column_conditional_styles,
            column_static_dropdown,
            column_static_style,
            dropdown_properties, // legacy
            editable,
            id,
            is_focused,
            selected_cell,
            viewport
        } = this.props;

        return viewport.dataframe.map((datum, viewportIdx) => {
            const realIdx = viewport.indices[viewportIdx];

            const deleteCell = this.rowDeleteCell(realIdx);
            const selectCell = this.rowSelectCell(realIdx);

            const cells = columns.map((column, visibleIndex) => {
                let legacyDropdown: any = (
                    (
                        dropdown_properties &&
                        dropdown_properties[column.id] &&
                        (
                            dropdown_properties[column.id].length > realIdx ?
                                dropdown_properties[column.id][realIdx] :
                                null
                        )
                    ) || column || {}
                ).options;

                const index = columns.indexOf(column);

                const classes = [`column-${index}`];

                let conditionalDropdowns = column_conditional_dropdowns.find((cd: any) => cd.id === column.id);
                let staticDropdown = column_static_dropdown.find((sd: any) => sd.id === column.id);

                conditionalDropdowns = conditionalDropdowns && conditionalDropdowns.dropdowns;
                staticDropdown = legacyDropdown || (staticDropdown && staticDropdown.dropdown);

                let conditionalStyles = column_conditional_styles.find((cs: any) => cs.id === column.id);
                let staticStyle = column_static_style.find((ss: any) => ss.id === column.id);

                conditionalStyles = conditionalStyles && conditionalStyles.styles;
                staticStyle = staticStyle && staticStyle.style;

                return (<Cell
                    key={`${column.id}-${visibleIndex}`}
                    active={active_cell[0] === viewportIdx && active_cell[1] === index}
                    classes={classes}
                    clearable={column.clearable}
                    conditionalDropdowns={conditionalDropdowns}
                    conditionalStyles={conditionalStyles}
                    datum={datum}
                    editable={editable}
                    focused={!!is_focused}
                    onClick={this.getEventHandler(this.handleClick, viewportIdx, index)}
                    onDoubleClick={this.getEventHandler(this.handleDoubleClick, viewportIdx, index)}
                    onPaste={this.handlePaste}
                    onChange={this.getEventHandler(this.handleChange, realIdx, index)}
                    property={column.id}
                    selected={R.contains([viewportIdx, index], selected_cell)}
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