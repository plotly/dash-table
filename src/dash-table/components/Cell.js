import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Dropdown from 'react-select';

import {colIsEditable} from 'dash-table/components/derivedState';
import { memoizeOne } from 'core/memoizer';

export const DEFAULT_CELL_WIDTH = 200;

export default class Cell extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.onOpenDropdown = this.onOpenDropdown.bind(this);

        this.notEditable = memoizeOne((editable, columns, i) => {
            return !colIsEditable(editable, columns[i]);
        });
    }

    onOpenDropdown() {
        const { dropdown } = this.refs;

        const menu = dropdown.wrapper.querySelector('.Select-menu-outer');

        const parentBoundingRect = menu.parentElement.getBoundingClientRect();

        menu.style.width = parentBoundingRect.width;
        menu.style.top = `${parentBoundingRect.y + parentBoundingRect.height}px`;
        menu.style.left = `${parentBoundingRect.x}px`;
        menu.style.position = 'fixed';
    }

    handleClick(e) {
        const {
            columns,
            editable,
            setProps,
            idx,
            i,
            is_focused,
            isSelected,
            selected_cell,
        } = this.props;
        if (!editable) {
            return;
        }
        if (!is_focused) {
            e.preventDefault();
        }

        // don't update if already selected
        if (isSelected && selected_cell.length === 1) {
            return;
        }

        e.preventDefault();
        const cellLocation = [idx, i];
        const newProps = {
            is_focused: false,
            active_cell: cellLocation,
        };

        // visible col indices
        const vci = [];
        columns.forEach((c, i) => {
            if (!c.hidden) {
                vci.push(i);
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
            ).filter(c => R.contains(c[1], vci));
        } else {
            newProps.selected_cell = [cellLocation];
        }
        setProps(newProps);
    }

    handleDoubleClick(e) {
        const {editable, setProps, idx, i, is_focused} = this.props;

        if (!editable) {
            return;
        }

        if (!is_focused) {
            e.preventDefault();
            const newProps = {
                selected_cell: [[idx, i]],
                active_cell: [idx, i],
                is_focused: true,
            };
            setProps(newProps);
        }
    }

    componentDidUpdate() {
        const {active_cell, idx, i} = this.props;
        const isActive = active_cell[0] === idx && active_cell[1] === i;
        if (this.textInput) {
            if (isActive && this.props.is_focused) {
                this.textInput.focus();
            }
        }
    }

    fixedColumnStyle() {}

    render() {
        const {
            c,
            editable,
            dropdown_properties,
            i,
            idx,
            isSelected,
            value,
            setProps,
            dataframe,
            is_focused,
            n_fixed_columns,
            row_deletable,
            row_selectable,
            columns,
            selected_cell,
            active_cell,
        } = this.props;

        const notEditable = this.notEditable(editable, columns, i);
        const isActive = active_cell[0] === idx && active_cell[1] === i;

        let innerCell;
        if (
            (!R.has('type', columns[i]) || R.contains(columns[i].type, ['numeric', 'text'])) &&
            !notEditable
        ) {
            innerCell = (
                <input
                    id={`${c.id}-${idx}`}
                    type="text"
                    value={value}
                    onClick={this.handleClick}
                    onDoubleClick={this.handleDoubleClick}
                    ref={el => (this.textInput = el)}
                    onChange={e => {
                        if (notEditable) {
                            return;
                        }
                        if (isSelected) {
                            const newDataframe = R.set(
                                R.lensPath([idx, c.id]),
                                e.target.value,
                                dataframe
                            );
                            setProps({
                                is_focused: true,
                                dataframe: newDataframe,
                            });
                        }
                    }}
                    onPaste={e => {
                        if (!(isSelected && is_focused)) {
                            e.preventDefault();
                        }
                    }}
                    className={
                        (isActive ? 'input-active ' : '') +
                        (is_focused && isActive ? 'focused ' : 'unfocused ')
                    }
                />
            );
        } else if (columns[i].type === 'dropdown') {
            let options;
            if (dropdown_properties &&
                    R.type(dropdown_properties) === 'Object' &&
                    R.has(columns[i].id, dropdown_properties) &&
                    idx < dropdown_properties[columns[i].id].length &&
                    R.has('options', dropdown_properties[columns[i].id][idx])) {
                options = dropdown_properties[columns[i].id][idx].options;
            } else {
                options = columns[i].options;
            }
            if (!options) {
                innerCell = value;
            } else {
                innerCell = (
                    <Dropdown
                        ref='dropdown'
                        placeholder={''}
                        options={options}
                        onChange={newOption => {
                            const newDataframe = R.set(
                                R.lensPath([idx, c.id]),
                                newOption ? newOption.value : newOption,
                                dataframe
                            );
                            setProps({dataframe: newDataframe});
                        }}
                        onOpen={this.onOpenDropdown}
                        clearable={columns[i].clearable}
                        value={value}
                    />
                );
            }
        } else {
            innerCell = value;
        }

        const fixedIndex = i +
            (row_deletable ? 1 : 0) +
            (row_selectable ? 1 : 0);

        return (
            <td
                className={
                    (isSelected && selected_cell.length > 1
                        ? 'cell--selected '
                        : '') +
                    (isActive ? 'focused ' : '') +
                    (notEditable ? 'cell--uneditable ' : '') +
                    (columns[i].type === 'dropdown' ? 'dropdown ' : '') +
                    (fixedIndex < n_fixed_columns ? `frozen-left frozen-left-${fixedIndex}` : '')
                }
                style={fixedIndex < n_fixed_columns ? {
                    width: `${c.width || DEFAULT_CELL_WIDTH}px`
                } : {}}
            >
                {innerCell}
            </td>
        );
    }
}

Cell.propTypes = {
    c: PropTypes.any,
    columns: PropTypes.any,
    dataframe: PropTypes.any,
    dropdown_properties: PropTypes.any,
    editable: PropTypes.any,
    i: PropTypes.any,
    idx: PropTypes.any,
    isSelected: PropTypes.any,
    is_focused: PropTypes.any,
    n_fixed_columns: PropTypes.any,
    row_deletable: PropTypes.any,
    row_selectable: PropTypes.any,
    selected_cell: PropTypes.any,
    setProps: PropTypes.any,
    value: PropTypes.any,
    active_cell: PropTypes.array,
};
