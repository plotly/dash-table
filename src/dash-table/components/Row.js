import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Cell from './Cell';
import computedStyles from './computedStyles';
import * as actions from '../utils/actions';

const getColLength = c => (Array.isArray(c.name) ? c.name.length : 1);

export default class Row extends Component {
    render() {
        const {
            columns,
            dataframe,
            idx,
            editable,
            setProps,
            selected_cell,
            selected_rows,
            row_deletable,
            row_selectable
        } = this.props;

        const rowSelectable = !row_selectable ? null : (
            <td style={R.merge(
                computedStyles.scroll.borderStyle(
                    R.merge({i: -1}, this.props)).style,
                    {'width': 30}
            )}>
                <input
                    type={row_selectable === 'single' ? 'radio' : 'checkbox'}
                    name="row-select"
                    style={{
                        'marginLeft': 'auto',
                        'marginRight': 'auto',
                        'width': 15,
                        'display': 'block'
                    }}
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
            <td className='delete-cell'
                style={R.merge(
                computedStyles.scroll.borderStyle(
                    R.merge({i: -1}, this.props)).style,
                    {
                        'width': 35,
                        'minWidth': 35,
                        'maxWidth': 35,
                        'padding': 0
                    })}
                onClick={() => setProps(actions.deleteRow(idx, this.props))}
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

        const headerDepth = Math.max.apply(Math, columns.map(getColLength));
        return (
            <tr
                style={computedStyles.scroll.row(this.props, idx + headerDepth)}
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
    selected_rows: PropTypes.any,
    row_deletable: PropTypes.bool,
    row_selectable: PropTypes.any
};
