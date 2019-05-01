import React from 'react';
import { storiesOf } from '@storybook/react';
import DataTable from 'dash-table/dash/DataTable';
import { BORDER_PROPS_DEFAULTS } from './Border.defaults.percy';

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
        filter
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
    />));