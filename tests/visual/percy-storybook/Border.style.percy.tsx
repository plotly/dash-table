import * as R from 'ramda';
import React from 'react';
import { storiesOf } from '@storybook/react';
import DataTable from 'dash-table/dash/DataTable';
import { BORDER_PROPS_DEFAULTS } from './Border.defaults.percy';

const variants = [
    { name: 'base', props: { } },
    { name: 'with ops', props: { row_deletable: true, row_selectable: 'single' } },
    { name: 'fixed columns', props: { n_fixed_columns: 2, row_deletable: true, row_selectable: 'single' } },
    { name: 'fixed rows', props: { n_fixed_rows: 1, row_deletable: true, row_selectable: 'single' } },
    { name: 'fixed columns & rows', props: { n_fixed_columns: 2, n_fixed_rows: 1, row_deletable: true, row_selectable: 'single' } },
    { name: 'fixed columns & rows inside fragments', props: { n_fixed_columns: 3, n_fixed_rows: 2, row_deletable: true, row_selectable: 'single' } }
];

const scenarios = [
    {
        name: 'with defaults',
        props: {}
    }, {
        name: 'with defaults & active cell (1,1)', props: {
            active_cell: {
                column: 1,
                column_id: 'b',
                row: 1,
                row_id: null
            }
        }
    }, {
        name: 'with defaults & active cell (0, 0)',
        props: {
            active_cell: {
                column: 0,
                column_id: 'a',
                row: 0,
                row_id: null
            }
        }
    }, {
        name: 'with cell style',
        props: {
            style_cell: {
                border: '1px solid hotpink'
            }
        }
    }, {
        name: 'with data style',
        props: {
            style_data: {
                border: '1px solid hotpink'
            }
        }
    }, {
        name: 'with header style',
        props: {
            style_header: {
                border: '1px solid hotpink'
            }
        }
    }, {
        name: 'with filter style',
        props: {
            style_filter: {
                border: '1px solid hotpink'
            }
        }
    }, {
        name: 'with header / cell (data) style - header wins on cell (data)',
        props: {
            style_cell: {
                border: '1px solid teal'
            },
            style_header: {
                border: '1px solid hotpink'
            }
        }
    }, {
        name: 'with header / data style - data wins on header',
        props: {
            style_data: {
                border: '1px solid teal'
            },
            style_header: {
                border: '1px solid hotpink'
            }
        }
    }, {
        name: 'with header / filter / cell (data) style - filter wins on header, filter wins on cell (data)',
        props: {
            filtering: true,
            style_cell: {
                border: '1px solid teal'
            },
            style_filter: {
                border: '1px solid burlywood'
            },
            style_header: {
                border: '1px solid hotpink'
            }
        }
    }, {
        name: 'with header / data / cell (filter) style - header wins on cell (filter), data wins on cell (filter)',
        props: {
            filtering: true,
            style_data: {
                border: '1px solid teal'
            },
            style_cell: {
                border: '1px solid burlywood'
            },
            style_header: {
                border: '1px solid hotpink'
            }
        }
    }, {
        name: 'with cell (header) / filter / data style - filter wins on cell (header), data wins on filter',
        props: {
            filtering: true,
            style_data: {
                border: '1px solid teal'
            },
            style_filter: {
                border: '1px solid burlywood'
            },
            style_cell: {
                border: '1px solid hotpink'
            }
        }
    }, {
        name: 'with data / cell (header, filter) style - data wins on filter',
        props: {
            filtering: true,
            style_data: {
                border: '1px solid teal'
            },
            style_cell: {
                border: '1px solid hotpink'
            }
        }
    }, {
        name: 'with header / filter / data style - data wins on filter, filter wins on header',
        props: {
            filtering: true,
            style_data: {
                border: '1px solid teal'
            },
            style_filter: {
                border: '1px solid burlywood'
            },
            style_header: {
                border: '1px solid hotpink'
            }
        }
    }, {
        name: 'style as list view',
        props: {
            filtering: true,
            style_data: {
                border: '1px solid teal'
            },
            style_filter: {
                border: '1px solid burlywood'
            },
            style_header: {
                border: '1px solid hotpink'
            },
            style_as_list_view: true
        }
    }
];

const tests = R.xprod(scenarios, variants);

R.reduce(
    (chain, [scenario, variant]) => chain.add(`${scenario.name} (${variant.name})`, () => (<DataTable
        {...R.mergeAll([
            BORDER_PROPS_DEFAULTS,
            variant.props,
            scenario.props
        ])}
    />)),
    storiesOf(`DashTable/Border, custom styles`, module),
    tests
);