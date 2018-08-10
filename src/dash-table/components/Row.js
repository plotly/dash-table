import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Cell from 'dash-table/components/Cell';
import * as actions from 'dash-table/utils/actions';

export default class Row extends Component {
    render() {
        const {
            columns,
            dataframe,
            idx,
            editable,
            n_fixed_columns,
            setProps,
            selected_cell,
            selected_rows,
            row_deletable,
            row_selectable
        } = this.props;

        const rowSelectableFixedIndex = row_deletable ? 1 : 0;

        const rowSelectable = !row_selectable ? null : (
            <td
                className={
                    'select-cell ' +
                    (n_fixed_columns > rowSelectableFixedIndex ? `frozen-left frozen-left-${rowSelectableFixedIndex}`: '')
                }
                style={n_fixed_columns > rowSelectableFixedIndex ? {
                    width: `30px`
                } : {}}
            >
                <input
                    type={row_selectable === 'single' ? 'radio' : 'checkbox'}
                    name="row-select"
                    checked={R.contains(idx, selected_rows)}
                    onChange={() => setProps({selected_rows:
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

        const deleteCell = !row_deletable ? null : (
            <td
                className={
                    'delete-cell ' +
                    (n_fixed_columns > 0 ? 'frozen-left frozen-left-0' : '')
                }
                onClick={() => setProps(actions.deleteRow(idx, this.props))}
                style={n_fixed_columns > 0 ? {
                    width: `30px`
                } : {}}
            >
                {'×'}
            </td>
        );

        const cells = columns.map((c, i) => {
            if (c.hidden) {
                return null;
            }

            return (
                <Cell
                    key={`${c.id}-${i}`}
                    value={dataframe[idx][c.id]}
                    type={c.type}
                    editable={editable}
                    isSelected={R.contains([idx, i], selected_cell)}
                    idx={idx}
                    i={i}
                    c={c}
                    setProps={setProps}
                    {...this.props}
                />
            );
        });

        return (
            <tr
                className={R.contains(idx, selected_rows) ? 'selected-row' : ''}
            >
                {deleteCell}
                {rowSelectable}

                {cells}
            </tr>
        );
    }
}

Row.propTypes = {
    columns: PropTypes.any,
    dataframe: PropTypes.any,
    idx: PropTypes.any,
    editable: PropTypes.any,
    setProps: PropTypes.any,
    selected_cell: PropTypes.any,
    active_cell: PropTypes.any,
    n_fixed_columns: PropTypes.any,
    selected_rows: PropTypes.any,
    row_deletable: PropTypes.bool,
    row_selectable: PropTypes.any
};
