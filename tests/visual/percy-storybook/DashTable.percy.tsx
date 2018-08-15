import React from 'react';
import { storiesOf } from '@storybook/react';
import DashTable from 'dash-table/components/Table';

const state = {
    tableProps: {
        id: 'table',
        dataframe: [],
        columns: [{ id: 'a', name: 'A' }],
        editable: true,
        // n_fixed_rows: 3,
        // n_fixed_columns: 2,
        sortable: false,
        sort: [],
        merge_duplicate_headers: true,
        row_deletable: true,
        row_selectable: 'single'
    },
    selectedFixture: null
};

const setProps = () => {
    // this.setState({
    //     tableProps: merge(state.tableProps, newProps),
    // });
};

storiesOf('DashTable', module)
    .add('with defaults', () => (<DashTable
        setProps={setProps}
        {...state.tableProps}
    />));