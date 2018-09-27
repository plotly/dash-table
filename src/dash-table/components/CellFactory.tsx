import * as R from 'ramda';
import React from 'react';

import Cell from 'dash-table/components/Cell';
import { ICellFactoryOptions } from 'dash-table/components/Table/props';
import * as actions from 'dash-table/utils/actions';
import derivedInputEventHandler, { Handler, CacheFn } from 'dash-table/derived/ui/cellEventHandler';

export default class CellFactory {
    private readonly inputEventHandler: CacheFn;

    private get props() {
        return this.propsFn();
    }

    constructor(private readonly propsFn: () => ICellFactoryOptions) {
        this.inputEventHandler = derivedInputEventHandler()(propsFn);
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

            const cells = columns.map((column, index) => {
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
                    key={`${column.id}-${index}`}
                    active={active_cell[0] === viewportIdx && active_cell[1] === index}
                    classes={classes}
                    clearable={column.clearable}
                    conditionalDropdowns={conditionalDropdowns}
                    conditionalStyles={conditionalStyles}
                    datum={datum}
                    editable={editable}
                    focused={!!is_focused}
                    onClick={this.inputEventHandler(Handler.Click, viewportIdx, index) as any}
                    onDoubleClick={this.inputEventHandler(Handler.DoubleClick, viewportIdx, index) as any}
                    onPaste={this.inputEventHandler(Handler.Paste, realIdx, index) as any}
                    onChange={this.inputEventHandler(Handler.Change, realIdx, index) as any}
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