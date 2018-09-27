import * as R from 'ramda';
import React from 'react';

import { ICellFactoryOptions } from 'dash-table/components/Table/props';
import * as actions from 'dash-table/utils/actions';
import derivedDataframeCells from 'dash-table/derived/ui/dataframeCells';
import derivedDataframeInputs from 'dash-table/derived/ui/dataframeInputs';

export default class CellFactory {
    private readonly dataframeCells = derivedDataframeCells();
    private readonly dataframeInputs = derivedDataframeInputs();

    private get props() {
        return this.propsFn();
    }

    constructor(private readonly propsFn: () => ICellFactoryOptions) {

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

        const wrappers = this.dataframeCells(
            active_cell,
            columns,
            column_conditional_styles,
            column_static_style,
            viewport.dataframe,
            editable,
            id,
            selected_cell
        );

        const inputs = this.dataframeInputs(
            active_cell,
            columns,
            viewport.dataframe,
            column_conditional_dropdowns,
            column_static_dropdown,
            dropdown_properties,
            editable,
            !!is_focused,
            id,
            this.propsFn
        );

        const tuples = R.map(
            ([i, w]) => R.zip(i, w),
            R.zip(inputs, wrappers)
        );

        const cells = R.map(
            row => R.map(
                ([input, wrapper]) => React.cloneElement(wrapper, { children: [input] }),
                row
            ),
            tuples
        );

        return R.addIndex<JSX.Element[], JSX.Element[]>(R.map)(
            (row, index) => {
                const rowDelete = this.rowDeleteCell(index);
                const rowSelect = this.rowSelectCell(index);

                return [
                    ...(rowDelete ? [rowDelete] : []),
                    ...(rowSelect ? [rowSelect] : []),
                    ...row
                ];
            },
            cells
        );
    }
}