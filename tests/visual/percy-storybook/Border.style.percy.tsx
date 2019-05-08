import * as R from 'ramda';
import React from 'react';
import { storiesOf } from '@storybook/react';
import DataTable from 'dash-table/dash/DataTable';
import { BORDER_PROPS_DEFAULTS } from './Border.defaults.percy';

const variants = [
    { name: 'with ops', props: { row_deletable: true, row_selectable: 'single' } },
    { name: 'fixed columns', props: { n_fixed_columns: 2, row_deletable: true, row_selectable: 'single' } },
    { name: 'fixed rows', props: { n_fixed_rows: 1, row_deletable: true, row_selectable: 'single' } },
    { name: 'fixed columns & rows', props: { n_fixed_columns: 2, n_fixed_rows: 1, row_deletable: true, row_selectable: 'single' } }
];

variants.forEach(variant => {
    storiesOf(`DashTable/Border, custom styles (variant=${variant.name})`, module)
        .add('with defaults', () => (<DataTable
            {...R.merge(BORDER_PROPS_DEFAULTS, variant.props)}
        />))
        .add('with defaults & active cell (1,1)', () => (<DataTable
            {...R.merge(BORDER_PROPS_DEFAULTS, variant.props)}
            active_cell={{
                column: 1,
                column_id: 'b',
                row: 1,
                row_id: null
            }}
        />))
        .add('with defaults & active cell (0, 0)', () => (<DataTable
            {...R.merge(BORDER_PROPS_DEFAULTS, variant.props)}
            active_cell={{
                column: 0,
                column_id: 'a',
                row: 0,
                row_id: null
            }}
        />))
        .add('with cell style', () => (<DataTable
            {...R.merge(BORDER_PROPS_DEFAULTS, variant.props)}
            style_cell={{
                border: '1px solid hotpink'
            }}
        />))
        .add('with data style', () => (<DataTable
            {...R.merge(BORDER_PROPS_DEFAULTS, variant.props)}
            style_data={{
                border: '1px solid hotpink'
            }}
        />))
        .add('with header style', () => (<DataTable
            {...R.merge(BORDER_PROPS_DEFAULTS, variant.props)}
            style_header={{
                border: '1px solid hotpink'
            }}
        />))
        .add('with filter style', () => (<DataTable
            {...R.merge(BORDER_PROPS_DEFAULTS, variant.props)}
            filtering={true}
            filter
            style_filter={{
                border: '1px solid hotpink'
            }}
        />))
        .add('with header / cell (data) style - header wins on cell (data)', () => (<DataTable
            {...R.merge(BORDER_PROPS_DEFAULTS, variant.props)}
            style_cell={{
                border: '1px solid teal'
            }}
            style_header={{
                border: '1px solid hotpink'
            }}
        />))
        .add('with header / data style - data wins on header', () => (<DataTable
            {...R.merge(BORDER_PROPS_DEFAULTS, variant.props)}
            style_data={{
                border: '1px solid teal'
            }}
            style_header={{
                border: '1px solid hotpink'
            }}
        />))
        .add('with header / filter / cell (data) style - filter wins on header, filter wins on cell (data)', () => (<DataTable
            {...R.merge(BORDER_PROPS_DEFAULTS, variant.props)}
            filtering={true}
            style_cell={{
                border: '1px solid teal'
            }}
            style_filter={{
                border: '1px solid burlywood'
            }}
            style_header={{
                border: '1px solid hotpink'
            }}
        />))
        .add('with header / data / cell (filter) style - header wins on cell (filter), data wins on cell (filter)', () => (<DataTable
            {...R.merge(BORDER_PROPS_DEFAULTS, variant.props)}
            filtering={true}
            style_data={{
                border: '1px solid teal'
            }}
            style_cell={{
                border: '1px solid burlywood'
            }}
            style_header={{
                border: '1px solid hotpink'
            }}
        />))
        .add('with cell (header) / filter / data style - filter wins on cell (header), data wins on filter', () => (<DataTable
            {...R.merge(BORDER_PROPS_DEFAULTS, variant.props)}
            filtering={true}
            style_data={{
                border: '1px solid teal'
            }}
            style_filter={{
                border: '1px solid burlywood'
            }}
            style_cell={{
                border: '1px solid hotpink'
            }}
        />))
        .add('with data / cell (header, filter) style - data wins on filter', () => (<DataTable
            {...R.merge(BORDER_PROPS_DEFAULTS, variant.props)}
            filtering={true}
            style_data={{
                border: '1px solid teal'
            }}
            style_cell={{
                border: '1px solid hotpink'
            }}
        />))
        .add('with header / filter / data style - data wins on filter, filter wins on header', () => (<DataTable
            {...R.merge(BORDER_PROPS_DEFAULTS, variant.props)}
            filtering={true}
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
        .add('style as list view', () => (<DataTable
            {...R.merge(BORDER_PROPS_DEFAULTS, variant.props)}
            filtering={true}
            style_data={{
                border: '1px solid teal'
            }}
            style_filter={{
                border: '1px solid burlywood'
            }}
            style_header={{
                border: '1px solid hotpink'
            }}
            style_as_list_view={true}
        />));
});