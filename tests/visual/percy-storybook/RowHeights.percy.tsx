import * as R from 'ramda';
import React from 'react';
import { storiesOf } from '@storybook/react';
import DataTable from 'dash-table/dash/DataTable';


const setProps = () => { };

const columns = ['a', 'b', 'c']

const data = (() => {

    return R.range(0, 25).map((val) => (
        ['a', 'b', 'c'].reduce((obj: any, key) => {
            obj[key] = 'hello world\n'.repeat(val % 5 + 1);
            return obj;
        }, {})
    ));
})();

const baseProps = {
    setProps,
    fill_width: false,
    id: 'table',
    data,
    style_data: { 'white-space': 'pre' },
    fixed_columns: { 'headers': true },
    row_selectable: 'multi',
    row_deletable: true
};

const props = Object.assign({}, baseProps, {
    columns: columns.map((id => ({ id: id, name: id.toUpperCase() })))
});

storiesOf('DashTable/Fixed columns', module)
    .add('default', () => (<DataTable
        {...props}
    />))
    .add('virtualized', () => (<DataTable
        {...props}
        virtualization={true}
    />));
