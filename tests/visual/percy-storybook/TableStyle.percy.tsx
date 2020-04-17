import * as R from 'ramda';
import React from 'react';
import { storiesOf } from '@storybook/react';
import DataTable from 'dash-table/dash/DataTable';

const setProps = () => { };

const data = [
    { Date: 'July 12th, 2013 - July 25th, 2013', Rep: 1, Dem: 10, Ind: 2, Region: 'Northern New York State to the Southern Appalachian Mountains', 'Election Polling Organization': 'The New York Times' },
    { Date: 'July 12th, 2013 - August 25th, 2013', Rep: -20, Dem: 20, Ind: 10924, Region: 'Canada', 'Election Polling Organization': 'Pew Research' },
    { Date: 'July 12th, 2014 - August 25th, 2014', Rep: 3.512, Dem: 30, Ind: 3912, Region: 'Southern Vermont', 'Election Polling Organization': 'The Washington Post' }
];

const columns = R.map(
    i => ({ name: i, id: i }),
    ['Date', 'Rep', 'Dem', 'Ind', 'Region', 'Election Polling Organization']
);

const props = {
    setProps,
    id: 'table',
    data,
    columns
};

storiesOf('DashTable/TableStyle', module)
    .add('minWidth 100%, fixed headers+1', () => (<DataTable
        {...props}
        fixed_columns={{ headers: true, data: 1 }}
        style_table={{ minWidth: '100%' }}
    />))
    .add('minWidth 100%, fixed headers+1, style_cell', () => (<DataTable
        {...props}
        fixed_columns={{ headers: true, data: 1 }}
        style_table={{ minWidth: '100%' }}
        style_cell={{
            // all three widths are needed
            minWidth: '180px',
            width: '180px',
            maxWidth: '180px',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }}
    />));


