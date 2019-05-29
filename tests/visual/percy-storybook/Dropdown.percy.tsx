import * as R from 'ramda';
import React from 'react';
import { storiesOf } from '@storybook/react';

import DataTable from 'dash-table/dash/DataTable';

const setProps = () => { };

const data = [
    { climate: 'Sunny', temperature: 13, city: 'NYC' },
    { climate: 'Snowy', temperature: 43, city: 'Montreal' },
    { climate: 'Sunny', temperature: 50, city: 'Miami' },
    { climate: 'Rainy', temperature: 30, city: 'NYC' }
];

const data2 = [
    { City: 'NYC', Neighborhood: 'Brooklyn', 'Temperature (F)': 70 },
    { City: 'Montreal', Neighborhood: 'Mile End', 'Temperature (F)': 60 },
    { City: 'Los Angeles', Neighborhood: 'Venice', 'Temperature (F)': 90 }
];

const columns = R.map(
    i => ({ name: i, id: i, presentation: 'dropdown' }),
    ['climate', 'temperature', 'city']
);

const columns2 = R.map(
    i => ({ name: i, id: i, presentation: 'dropdown' }),
    ['City', 'Neighborhood', 'Temperature (F)']
);

storiesOf('DashTable/Dropdown', module)
    .add('dropdown by column', () => (<DataTable
        setProps={setProps}
        id='table'
        data={data}
        columns={columns}
        editable={true}
        column_dropdown={{
            climate: {
                dropdown: R.map(
                    i => ({ label: i, value: i }),
                    ['Sunny', 'Snowy', 'Rainy']
                )
            },
            city: {
                dropdown: R.map(
                    i => ({ label: i, value: i }),
                    ['NYC', 'Montreal', 'Miami']
                )
            }
        }}
    />))
    .add('dropdown by filtering', () => (<DataTable
        setProps={setProps}
        id='table'
        data={data2}
        columns={columns2}
        editable={true}
        column_dropdown_conditional={[{
            id: 'Neighborhood',
            dropdowns: [{
                condition: '{City} eq "NYC"',
                dropdown: R.map(
                    i => ({ label: i, value: i }),
                    ['Brooklyn', 'Queens', 'Staten Island']
                )
            }, {
                condition: '{City} eq "Montreal"',
                dropdown: R.map(
                    i => ({ label: i, value: i }),
                    ['Mile End', 'Plateau', 'Hochelaga']
                )
            }, {
                condition: '{City} eq "Los Angeles"',
                dropdown: R.map(
                    i => ({ label: i, value: i }),
                    ['Venice', 'Hollywood', 'Los Feliz']
                )
            }]
        }]}
    />)).add('dropdown by cell (deprecated)', () => (<DataTable
        setProps={setProps}
        id='table'
        data={data2}
        columns={columns2}
        editable={true}
        column_dropdown_data={{
            Neighborhood: [{
                dropdown: R.map(
                    i => ({ label: i, value: i }),
                    ['Brooklyn', 'Queens', 'Staten Island']
                )
            }, {
                dropdown: R.map(
                    i => ({ label: i, value: i }),
                    ['Mile End', 'Plateau', 'Hochelaga']
                )
            }, {
                dropdown: R.map(
                    i => ({ label: i, value: i }),
                    ['Venice', 'Hollywood', 'Los Feliz']
                )
            }]
        }}
    />));