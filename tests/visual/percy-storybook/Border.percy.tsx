import * as R from 'ramda';
import React from 'react';
import {storiesOf} from '@storybook/react';
import random from 'core/math/random';
import DataTable from 'dash-table/dash/DataTable';

const setProps = () => {};

const columns = ['a', 'b', 'c'].map(id => ({id: id, name: id.toUpperCase()}));

const data = (() => {
    const r = random(1);

    return R.range(0, 5).map(() =>
        ['a', 'b', 'c'].reduce((obj: any, key) => {
            obj[key] = Math.floor(r() * 1000);
            return obj;
        }, {})
    );
})();

const columns2 = ['a', 'b', 'c', 'd', 'e', 'f'].map(id => ({
    id: id,
    name: id.toUpperCase(),
}));

const data2 = (() => {
    const r = random(1);

    return R.range(0, 50).map(() =>
        ['a', 'b', 'c', 'd', 'e', 'f'].reduce((obj: any, key) => {
            obj[key] = Math.floor(r() * 1000);
            return obj;
        }, {})
    );
})();

const style_table = {
    height: 500,
    width: 500,
};

const style_data_conditional = [{width: 100}];

let props = {
    setProps,
    id: 'table',
    data: data,
    columns,
    style_data_conditional,
    style_table,
};

let props2 = {
    setProps,
    id: 'table',
    data: data2,
    columns: columns2,
    style_data_conditional,
    style_table,
};

storiesOf('DashTable/Border (available space not filled)', module)
    .add('with no frozen rows and no frozen columns', () => (
        <DataTable {...props} />
    ))
    .add('with frozen rows and no frozen columns', () => (
        <DataTable {...props} n_fixed_rows={1} />
    ))
    .add('with no frozen rows and frozen columns', () => (
        <DataTable {...props} n_fixed_columns={1} />
    ))
    .add('with frozen rows and frozen columns', () => (
        <DataTable {...props} n_fixed_columns={1} n_fixed_rows={1} />
    ));

storiesOf('DashTable/Border (available space filled)', module)
    .add('with no frozen rows and no frozen columns', () => (
        <DataTable {...props2} />
    ))
    .add('with frozen rows and no frozen columns', () => (
        <DataTable {...props2} n_fixed_rows={1} />
    ))
    .add('with no frozen rows and frozen columns', () => (
        <DataTable {...props2} DataTable n_fixed_columns={1} />
    ))
    .add('with frozen rows and frozen columns', () => (
        <DataTable {...props2} n_fixed_columns={1} n_fixed_rows={1} />
    ));

let props3 = Object.assign({}, props, {
    style_as_list_view: true,
});

let props4 = Object.assign({}, props2, {
    style_as_list_view: true,
});

storiesOf(
    'DashTable/ListView style, Border (available space not filled)',
    module
)
    .add('with no frozen rows and no frozen columns', () => (
        <DataTable {...props3} />
    ))
    .add('with frozen rows and no frozen columns', () => (
        <DataTable {...props3} n_fixed_rows={1} />
    ))
    .add('with no frozen rows and frozen columns', () => (
        <DataTable {...props3} n_fixed_columns={1} />
    ))
    .add('with frozen rows and frozen columns', () => (
        <DataTable {...props3} n_fixed_columns={1} n_fixed_rows={1} />
    ));

storiesOf('DashTable/ListView style, Border (available space filled)', module)
    .add('with no frozen rows and no frozen columns', () => (
        <DataTable {...props4} />
    ))
    .add('with frozen rows and no frozen columns', () => (
        <DataTable {...props4} n_fixed_rows={1} />
    ))
    .add('with no frozen rows and frozen columns', () => (
        <DataTable {...props4} n_fixed_columns={1} />
    ))
    .add('with frozen rows and frozen columns', () => (
        <DataTable {...props4} n_fixed_columns={1} n_fixed_rows={1} />
    ));

const props_style_data = {
    ...props,
    style_data: {
        border: '1px solid hotpink',
    },
    style_data_conditional: [],
};
const props_specific_borders = {
    ...props,
    style_data: {},
    style_data_conditional: [
        {
            if: {
                row_index: 1,
                column_id: 'b',
            },
            borderTop: '2px solid red',
        },
        {
            if: {
                row_index: 2,
                column_id: 'b',
            },
            borderRight: '2px solid blue',
        },
        {
            if: {
                row_index: 3,
                column_id: 'b',
            },
            borderBottom: '2px solid magenta',
        },
        {
            if: {
                row_index: 4,
                column_id: 'b',
            },
            borderLeft: '2px solid green',
        },
    ],
};

const props_sharing_horizontal = {
    ...props,
    style_data: {},
    style_data_conditional: [
        {
            if: {column_id: 'b'},
            max_width: 200,
            min_width: 200,
            width: 200,
            border: '1px solid cyan',
        },
        {
            if: {column_id: 'c'},
            max_width: 200,
            min_width: 200,
            width: 200,
            border: '1px solid magenta',
        },
    ],
};
const props_sharing_vertical = {
    ...props,
    style_data: {},
    style_data_conditional: [
        {
            if: {
                row_index: 1,
                column_id: 'a',
            },
            border: '2px solid red',
        },
        {
            if: {
                row_index: 2,
                column_id: 'a',
            },
            border: '2px solid blue',
        },
        {
            if: {
                row_index: 3,
                column_id: 'a',
            },
            border: '2px solid magenta',
        },
        {
            if: {
                row_index: 4,
                column_id: 'a',
            },
            border: '2px solid green',
        },
        {
            if: {
                row_index: 4,
                column_id: 'c',
            },
            border: '2px solid green',
        },
        {
            if: {
                row_index: 3,
                column_id: 'c',
            },
            border: '2px solid magenta',
        },
        {
            if: {
                row_index: 2,
                column_id: 'c',
            },
            border: '2px solid blue',
        },
        {
            if: {
                row_index: 1,
                column_id: 'c',
            },
            border: '2px solid red',
        },
    ],
};
const props_top_bottom = {
    ...props,
    style_data: {},
    style_data_conditional: [
        {
            if: {
                row_index: 2,
                column_id: 'b',
            },
            borderTop: '2px solid red',
        },
        {
            if: {
                row_index: 1,
                column_id: 'b',
            },
            borderBottom: '2px solid blue',
        },
        {
            if: {
                row_index: 1,
                column_id: 'c',
            },
            borderBottom: '2px solid blue',
        },
        {
            if: {
                row_index: 2,
                column_id: 'c',
            },
            borderTop: '2px solid red',
        },
    ],
};
const props_left_right = {
    ...props,
    style_data: {},
    style_data_conditional: [
        {
            if: {
                row_index: 2,
                column_id: 'b',
            },
            borderRight: '2px solid red',
        },
        {
            if: {
                row_index: 2,
                column_id: 'c',
            },
            borderLeft: '2px solid blue',
        },
        {
            if: {
                row_index: 3,
                column_id: 'c',
            },
            borderLeft: '2px solid blue',
        },
        {
            if: {
                row_index: 3,
                column_id: 'b',
            },
            borderRight: '2px solid red',
        },
    ],
};
const props_viewport = {
    ...props,
    style_data: {},
    style_data_conditional: [
        {
            if: {
                row_index: 2,
                column_id: 'b',
            },
            borderTop: '2px solid red',
            borderLeft: '2px solid red',
        },
        {
            if: {
                row_index: 2,
                column_id: 'c',
            },
            borderTop: '2px solid red',
            borderRight: '2px solid red',
        },
        {
            if: {
                row_index: 3,
                column_id: 'b',
            },
            borderLeft: '2px solid red',
        },
        {
            if: {
                row_index: 3,
                column_id: 'c',
            },
            borderRight: '2px solid red',
        },
        {
            if: {
                row_index: 4,
                column_id: 'b',
            },
            borderLeft: '2px solid red',
            borderBottom: '2px solid red',
        },
        {
            if: {
                row_index: 4,
                column_id: 'c',
            },
            borderBottom: '2px solid red',
            borderRight: '2px solid red',
        },
    ],
};

storiesOf('DashTable/Border, custom styles', module)
    .add('with style_data', () => <DataTable {...props_style_data} />)
    .add('with style_data conditional, border top, right, bottom, left', () => (
        <DataTable {...props_specific_borders} />
    ))
    .add(
        'with style_data conditional, sharing borders horizontal borders',
        () => <DataTable {...props_sharing_horizontal} />
    )
    .add('with style_data conditional, sharing vertical borders', () => (
        <DataTable {...props_sharing_vertical} />
    ))
    .add(
        'with style_data conditional, border-top and border-bottom fighting',
        () => <DataTable {...props_top_bottom} />
    )
    .add(
        'with style_data conditional, border-left and border-right fighting',
        () => <DataTable {...props_left_right} />
    )
    .add('with style_data conditional, borders creating a "viewport"', () => (
        <DataTable {...props_viewport} />
    ));
