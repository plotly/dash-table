import parser from 'papaparse';
import * as R from 'ramda';
import React from 'react';
import { storiesOf } from '@storybook/react';

import DataTable from 'dash-table/dash/DataTable';

import dataset from './../../assets/gapminder.csv';
const result = parser.parse(dataset, { delimiter: ',', header: true });

const getColumns = () => R.addIndex(R.map)(
    (id, index) => ({
        name: [
            Math.floor(index / 4).toString(),
            Math.floor(index / 2).toString(),
            id
        ],
        id
    }),
    result.meta.fields
);

interface ITest {
    name: string;
    props: any;
}

const DEFAULT_PROPS = {
    id: 'table',
    data: result.data.slice(0, 10)
};

const variants: ITest[] = [
    { name: 'merged', props: { merge_duplicate_headers: true } },
    { name: 'unmerged', props: { merge_duplicate_headers: false } }
];

const scenarios: ITest[] = [
    {
        name: 'default (bottom row)',
        props: {
            columns: getColumns(),
            hideable: true
        }
    },
    {
        name: 'explicit bottom row',
        props: {
            columns: getColumns(),
            hideable: true,
            hideable_row: 2
        }
    },
    {
        name: 'explicit middle row',
        props: {
            columns: getColumns(),
            hideable: true,
            hideable_row: 1
        }
    },
    {
        name: 'explicit top row',
        props: {
            columns: getColumns(),
            hideable: true,
            hideable_row: 0
        }
    },
    {
        name: 'some non-hideable top rows',
        props: {
            columns: getColumns().map((c: any, i) => {
                if (i % 8 === 0) {
                    c.hideable = false;
                }

                return c;
            }),
            hideable: true,
            hideable_row: 0
        }
    },
    {
        name: 'some non-hideable middle rows',
        props: {
            columns: getColumns().map((c: any, i) => {
                if (i % 4 === 0) {
                    c.hideable = false;
                }

                return c;
            }),
            hideable: true,
            hideable_row: 1
        }
    },
    {
        name: 'some non-hideable bottom rows',
        props: {
            columns: getColumns().map((c: any, i) => {
                if (i % 2 === 0) {
                    c.hideable = false;
                }

                return c;
            }),
            hideable: true,
            hideable_row: 2
        }
    },
    {
        name: 'some hideable top rows',
        props: {
            columns: getColumns().map((c: any, i) => {
                if (i % 8 === 0) {
                    c.hideable = true;
                }

                return c;
            }),
            hideable: false,
            hideable_row: 0
        }
    },
    {
        name: 'some hideable middle rows',
        props: {
            columns: getColumns().map((c: any, i) => {
                if (i % 4 === 0) {
                    c.hideable = true;
                }

                return c;
            }),
            hideable: false,
            hideable_row: 1
        }
    },
    {
        name: 'some hideable bottom rows',
        props: {
            columns: getColumns().map((c: any, i) => {
                if (i % 2 === 0) {
                    c.hideable = true;
                }

                return c;
            }),
            hideable: false,
            hideable_row: 2
        }
    }
];

const tests = R.xprod(scenarios, variants);

R.reduce(
    (chain, [scenario, variant]) => chain.add(`${scenario.name} (${variant.name})`, () => (<DataTable
        {...R.mergeAll([
            DEFAULT_PROPS,
            variant.props,
            scenario.props
        ])}
    />)),
    storiesOf(`DashTable/Hideable Columns`, module),
    tests
);