/* eslint no-magic-numbers: 0 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

class Cell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            focussed: false
        }
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.updateHeight = this.updateHeight.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleDocumentClick, false);
        this.updateHeight();
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleDocumentClick, false);
    }

    handleDocumentClick (e) {
        if (!this.node.contains(e.target) && this.state.focussed) {
            this.setState({
                focussed: false,
            });
            this.node.style.width = null;
        }
    }

    handleCellClick(e) {
        const payload = {
            tdheight: window.getComputedStyle(this.node).height,
            tdwidth:  (
                parseFloat(window.getComputedStyle(this.node).width, 10) -
                (parseFloat(window.getComputedStyle(this.node).paddingLeft, 10) +
                 parseFloat(window.getComputedStyle(this.node).paddingLeft, 10)
             )
            ),
            focussed: true
        };
        // Lock down the width
        this.node.style.height = window.getComputedStyle(this.node).height;
        this.node.style.width = window.getComputedStyle(this.node).width;
        console.warn(payload);
        this.setState(payload);
    }

    updateHeight() {
        if (this.textarea) {
            console.warn('Setting textarea to 0');
            this.textarea.style.height = 0;
            const computedHeight = Math.max(
                35, // This could also be the computed line height of this.node
                this.textarea.scrollHeight
            );
            console.warn(`Setting textarea to ${computedHeight}`);
            this.textarea.style.height = computedHeight;
        }
    }

    handleKeyPress (e) {
        const payload = {value: e.target.value};
        if (Math.abs(parseFloat(this.textarea.scrollHeight) -
                parseFloat(this.state.tdheight)) > 1) {
            // handle adding or removing text
            this.textarea.style.height = this.textarea.scrollHeight;
        }

        this.setState({value: e.target.value});
    }

    render() {
        const {editable, style} = this.props;
        const {value, focussed} = this.state;
        let inner;
        let tdstyle = R.clone(style);
        if (editable && focussed) {

            // maxWidth to 0 is used for ellipses overflow
            // when the content becomes a textarea, this collapses.
            // so, clear the maxWidth property when rendering the textarea
            if (parseFloat(tdstyle.maxWidth, 10) === 0) {
                tdstyle.maxWidth = null;
            }
            inner = <textarea
                value={value}
                style={{
                    height: this.state.tdheight,
                    width: this.state.tdwidth
                }}
                onChange={this.handleKeyPress}
                ref={textarea => this.textarea = textarea}
            />
        } else {
            inner = value;
        }
        return (
            <td style={tdstyle}
                onClick={this.handleCellClick}
                ref={node => this.node = node}
            >
                {inner}
            </td>
        );
    }
}


class TableLite extends Component {
    render() {
        const {
            columns,
            editable,
            rows,

            style_table,
            style_row,
            style_row_even,
            style_row_odd,

            style_cell,
            style_cell_by_column,

            style_header,
            style_header_by_column,

            style_cell_and_header,
            style_cell_and_header_by_column,
        } = this.props;
        return (
            <table style={style_table} className="table-light">
                <thead>
                    {columns.map(c =>
                        <th style={R.mergeAll([
                            style_row,
                            style_cell_and_header,
                            R.propOr({}, c.name, style_cell_and_header_by_column),
                            style_header,
                            R.propOr({}, c.name, style_header_by_column)
                        ])}>
                            {c.name}
                        </th>
                    )}
                </thead>
                <tbody>
                    {rows.map(
                        (row, rowIndex) => (
                            <tr style={R.mergeAll([
                                style_row,
                                rowIndex % 2 === 0 ? style_row_even : style_row_odd,
                            ])}>{row.map((cell, i) =>
                                <Cell
                                    style={R.mergeAll([
                                        style_cell_and_header,
                                        R.propOr({}, columns[i].name, style_cell_and_header_by_column),

                                        style_cell,
                                        R.propOr({}, columns[i].name, style_cell_by_column),
                                    ])}
                                    value={cell}
                                    editable={editable}
                                />
                            )}
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        );
    }
}

TableLite.defaultProps = {
    style_table: {},

    style_row: {},
    style_row_even: {},
    style_row_odd: {},

    style_cell: {},
    style_cell_by_column: {},

    style_header: {},
    style_header_by_column: {},

    style_cell_and_header: {},
    style_cell_and_header_by_column: {},

    editable: true
}

export const propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string),
    rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),

    style_table: PropTypes.object,

    style_row: PropTypes.object,
    style_row_even: PropTypes.object,
    style_row_odd: PropTypes.object,

    style_cell: PropTypes.object,
    style_cell_by_column: PropTypes.object,

    style_header: PropTypes.object,
    style_header_by_column: PropTypes.object,

    style_cell_and_header: PropTypes.object,
    style_cell_and_header_by_column: PropTypes.object,

    editable: PropTypes.bool
}
TableLite.propTypes = propTypes;


export default TableLite;
