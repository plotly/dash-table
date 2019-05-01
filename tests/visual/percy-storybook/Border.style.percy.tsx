import React from 'react';
import { storiesOf } from '@storybook/react';
import DataTable from 'dash-table/dash/DataTable';
import { BORDER_PROPS_DEFAULTS } from './Border.defaults.percy';

const props_style_data = {
    ...BORDER_PROPS_DEFAULTS,
    style_data: {
        border: '1px solid hotpink'
    }
};

const props_specific_borders = {
    ...BORDER_PROPS_DEFAULTS,
    style_data: {},
    style_data_conditional: [
        {
            if: {
                row_index: 1,
                column_id: 'b'
            },
            borderTop: '2px solid red'
        },
        {
            if: {
                row_index: 2,
                column_id: 'b'
            },
            borderRight: '2px solid blue'
        },
        {
            if: {
                row_index: 3,
                column_id: 'b'
            },
            borderBottom: '2px solid magenta'
        },
        {
            if: {
                row_index: 4,
                column_id: 'b'
            },
            borderLeft: '2px solid green'
        }
    ]
};

const props_sharing_horizontal = {
    ...BORDER_PROPS_DEFAULTS,
    style_data: {},
    style_data_conditional: [
        {
            if: { column_id: 'b' },
            max_width: 200,
            min_width: 200,
            width: 200,
            border: '1px solid cyan'
        },
        {
            if: { column_id: 'c' },
            max_width: 200,
            min_width: 200,
            width: 200,
            border: '1px solid magenta'
        }
    ]
};
const props_sharing_vertical = {
    ...BORDER_PROPS_DEFAULTS,
    style_data: {},
    style_data_conditional: [
        {
            if: {
                row_index: 1,
                column_id: 'a'
            },
            border: '2px solid red'
        },
        {
            if: {
                row_index: 2,
                column_id: 'a'
            },
            border: '2px solid blue'
        },
        {
            if: {
                row_index: 3,
                column_id: 'a'
            },
            border: '2px solid magenta'
        },
        {
            if: {
                row_index: 4,
                column_id: 'a'
            },
            border: '2px solid green'
        },
        {
            if: {
                row_index: 4,
                column_id: 'c'
            },
            border: '2px solid green'
        },
        {
            if: {
                row_index: 3,
                column_id: 'c'
            },
            border: '2px solid magenta'
        },
        {
            if: {
                row_index: 2,
                column_id: 'c'
            },
            border: '2px solid blue'
        },
        {
            if: {
                row_index: 1,
                column_id: 'c'
            },
            border: '2px solid red'
        }
    ]
};
const props_top_bottom = {
    ...BORDER_PROPS_DEFAULTS,
    style_data: {},
    style_data_conditional: [
        {
            if: {
                row_index: 2,
                column_id: 'b'
            },
            borderTop: '2px solid red'
        },
        {
            if: {
                row_index: 1,
                column_id: 'b'
            },
            borderBottom: '2px solid blue'
        },
        {
            if: {
                row_index: 1,
                column_id: 'c'
            },
            borderBottom: '2px solid blue'
        },
        {
            if: {
                row_index: 2,
                column_id: 'c'
            },
            borderTop: '2px solid red'
        }
    ]
};
const props_left_right = {
    ...BORDER_PROPS_DEFAULTS,
    style_data: {},
    style_data_conditional: [
        {
            if: {
                row_index: 2,
                column_id: 'b'
            },
            borderRight: '2px solid red'
        },
        {
            if: {
                row_index: 2,
                column_id: 'c'
            },
            borderLeft: '2px solid blue'
        },
        {
            if: {
                row_index: 3,
                column_id: 'c'
            },
            borderLeft: '2px solid blue'
        },
        {
            if: {
                row_index: 3,
                column_id: 'b'
            },
            borderRight: '2px solid red'
        }
    ]
};
const props_viewport = {
    ...BORDER_PROPS_DEFAULTS,
    style_data: {},
    style_data_conditional: [
        {
            if: {
                row_index: 2,
                column_id: 'b'
            },
            borderTop: '2px solid red',
            borderLeft: '2px solid red'
        },
        {
            if: {
                row_index: 2,
                column_id: 'c'
            },
            borderTop: '2px solid red',
            borderRight: '2px solid red'
        },
        {
            if: {
                row_index: 3,
                column_id: 'b'
            },
            borderLeft: '2px solid red'
        },
        {
            if: {
                row_index: 3,
                column_id: 'c'
            },
            borderRight: '2px solid red'
        },
        {
            if: {
                row_index: 4,
                column_id: 'b'
            },
            borderLeft: '2px solid red',
            borderBottom: '2px solid red'
        },
        {
            if: {
                row_index: 4,
                column_id: 'c'
            },
            borderBottom: '2px solid red',
            borderRight: '2px solid red'
        }
    ]
};

storiesOf('DashTable/Border, custom styles', module)
    .add('with defaults', () => (<DataTable
        {...BORDER_PROPS_DEFAULTS}
    />))
    .add('with cell style', () => (<DataTable
        {...BORDER_PROPS_DEFAULTS}
        style_cell={{
            border: '1px solid hotpink'
        }}
    />))
    .add('with data style', () => (<DataTable
        {...BORDER_PROPS_DEFAULTS}
        style_data={{
            border: '1px solid hotpink'
        }}
    />))
    .add('with header style', () => (<DataTable
        {...BORDER_PROPS_DEFAULTS}
        style_header={{
            border: '1px solid hotpink'
        }}
    />))
    .add('with filter style', () => (<DataTable
        {...BORDER_PROPS_DEFAULTS}
        filtering={true}
        style_filter={{
            border: '1px solid hotpink'
        }}
    />))
    .add('with header / data style - data wins on header', () => (<DataTable
        {...BORDER_PROPS_DEFAULTS}
        style_data={{
            border: '1px solid teal'
        }}
        style_header={{
            border: '1px solid hotpink'
        }}
    />))
    .add('with header / filter / data style - data wins on filter, filter wins on header', () => (<DataTable
        {...BORDER_PROPS_DEFAULTS}
        style_data={{
            border: '1px solid teal'
        }}
        style_filter={{
            border: '1px solid burlywood'
        }}
        style_header={{
            border: '1px solid hotpink'
        }}
    />))
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