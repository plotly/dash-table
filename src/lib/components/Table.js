import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

import ControlledTable from './ControlledTable';

import 'react-select/dist/react-select.css';
import './Table.css';
import './Dropdown.css';

export default class Table extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.setProps) {
            const newProps = R.mergeAll([
                this.props,
                this.state,
                {
                    setProps: newProps => this.setState(newProps),
                },
            ]);
            return <ControlledTable {...newProps} />;
        }

        return (
            <ControlledTable
                {...R.merge(this.props, {
                    setProps: newProps => {

                        // !is_focused -> is_focused: save the current dataframe
                        if (newProps.is_focused && !this.props.is_focused) {
                            console.warn('Saving dataframe', this.props.dataframe);
                            this.dataframe_previous = this.props.dataframe;
                        }

                        // unfocused -> send the old dataframe and the update time
                        if (!newProps.is_focused && this.props.is_focused &&
                            this.props.update_on_unfocus) {
                            console.warn('Updating timestamp');
                            newProps.dataframe_timestamp = Date.now();
                            newProps.dataframe_previous = this.dataframe_previous;

                        // table is unfocused but user copied and pasted data
                        } else if (!this.props.is_focused &&
                                   R.has('dataframe', newProps)) {
                            newProps.dataframe_previous = this.props.dataframe;
                            newProps.dataframe_timestamp = Date.now();
                        // user wants the new dataframe on every letter press
                        } else if (!this.props.update_on_unfocus &&
                                   R.has('dataframe', newProps)) {
                            newProps.dataframe_previous = this.dataframe_previous;
                            newProps.dataframe_timestamp = Date.now();
                        }

                        this.props.setProps(newProps);

                    },
                })}
            />
        );
    }
}

export const defaultProps = {
    virtualization: 'none',
    v_fe_page_options: {
        pageSize: 20
    },

    changed_data: {},
    dataframe: [],
    columns: [],
    editable: false,
    active_cell: [],
    index_name: '',
    types: {},
    merged_styles: {},
    selected_cell: [[]],
    selected_rows: [],
    row_selectable: false,
    display_row_count: 20,
    display_tail_count: 5,
    base_styles: {
        numeric: {
            'text-align': 'right',
            'font-family': "'Droid Sans Mono', Courier, monospace",
        },

        string: {
            'text-align': 'left',
        },

        input: {
            padding: 0,
            margin: 0,
            width: '80px',
            border: 'none',
            'font-size': '1rem',
        },

        'input-active': {
            outline: '#7FDBFF auto 3px',
        },

        table: {},

        thead: {},

        th: {},

        td: {},
    },
    update_on_unfocus: true
};

export const propTypes = {
    active_cell: PropTypes.array,
    collapsable: PropTypes.bool,
    columns: PropTypes.arrayOf(PropTypes.object),

    dataframe: PropTypes.arrayOf(PropTypes.object),
    dataframe_previous: PropTypes.arrayOf(PropTypes.object),
    dataframe_timestamp: PropTypes.any,
    /**
     * Only send an update of  `dataframe_previous` and `dataframe_timestamp`
     * when the cell is unfocused ()
     */
    update_on_unfocus: PropTypes.bool,

    display_row_count: PropTypes.number,
    display_tail_count: PropTypes.number,

    dropdown_properties: PropTypes.objectOf(
        PropTypes.arrayOf(PropTypes.shape({
            'options': PropTypes.shape({
                'label': PropTypes.string,
                'value': PropTypes.string,
                'required': PropTypes.bool
            }),
            'disabled': PropTypes.bool,
            // And the rest of the dropdown props...
        }))
    ),

    editable: PropTypes.bool,
    end_cell: PropTypes.arrayOf(PropTypes.number),
    // TODO - Remove `expanded_rows`
    expanded_rows: PropTypes.array,
    id: PropTypes.string.isRequired,
    is_focused: PropTypes.bool,
    merge_duplicate_headers: PropTypes.bool,
    n_fixed_columns: PropTypes.number,
    n_fixed_rows: PropTypes.number,
    row_deletable: PropTypes.bool,
    row_selectable: PropTypes.oneOf(['single', 'multi']),
    selected_cell: PropTypes.arrayOf(PropTypes.number),
    selected_rows: PropTypes.arrayOf(PropTypes.number),
    setProps: PropTypes.any,
    sort: PropTypes.array,
    sortable: PropTypes.bool,
    start_cell: PropTypes.arrayOf(PropTypes.number),
    style_as_list_view: PropTypes.bool,
    table_style: PropTypes.any,

    virtualization: PropTypes.string,
    v_fe_page_options: PropTypes.shape({
        pageSize: PropTypes.number
    })
};

Table.defaultProps = defaultProps;
Table.propTypes = propTypes;