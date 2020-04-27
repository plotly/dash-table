import React from 'react';
import { storiesOf } from '@storybook/react';
import DataTable from 'dash-table/dash/DataTable';

const setProps = () => { };

storiesOf('DashTable/CSS override', module)
    .add('css with escaped id', () => (<DataTable
        setProps={setProps}
        id={'`~!@#$%^&*()=+ \\|/.,:;\'"`?[]<>{}'}
        data={[
            { a: 1, b: 2, c: 3 },
            { a: 2, b: 4, c: 6 },
            { a: 3, b: 6, c: 9 }
        ]}
        columns={[
            { id: 'a', name: 'A' },
            { id: 'b', name: 'B' },
            { id: 'c', name: 'C' }
        ]}
        css={[
            { selector: 'td', rule: 'background-color: red !important;' }
        ]}
    />))