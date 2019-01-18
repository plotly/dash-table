import * as R from 'ramda';

import Environment from 'core/environment';

import { generateMockData, IDataMock } from './data';
import {
    ContentStyle,
    PropsWithDefaults,
    ChangeAction,
    ChangeFailure,
    IVisibleColumn
} from 'dash-table/components/Table/props';
import { TooltipSyntax } from 'dash-table/tooltips/props';

export enum AppMode {
    Default = 'default',
    FixedVirtualized = 'fixed,virtualized',
    ReadOnly = 'readonly',
    Typed = 'typed',
    Virtualized = 'virtualized'
}

export const ReadWriteModes = [
    AppMode.Default,
    AppMode.FixedVirtualized,
    AppMode.Virtualized
];

function getBaseTableProps(mock: IDataMock) {
    return {
        id: 'table',
        columns: mock.columns.map((col: any) => R.merge(col, {
            name: col.name || col.id,
            on_change: {
                action: ChangeAction.None
            },
            editable_name: true,
            deletable: true
        })),
        column_static_dropdown: [
            {
                id: 'bbb',
                dropdown: ['Humid', 'Wet', 'Snowy', 'Tropical Beaches'].map(i => ({
                    label: i,
                    value: i
                }))
            }
        ],
        column_static_tooltip: {
            ccc: {
                type: TooltipSyntax.Markdown,
                value: `### ccc 1\nThis tooltip 1`
            }
        },
        column_conditional_tooltips: [
            {
                if: {
                    column_id: 'ccc',
                    row_index: 5
                },
                type: TooltipSyntax.Markdown,
                value: `### ccc 2\nThis tooltip 2`
            },
            {
                if: {
                    filter: 'ccc eq num(20)'
                },
                type: TooltipSyntax.Markdown,
                value: `### ccc 3\nThis tooltip 3`
            },
            {
                if: {
                    filter: 'ccc eq num(15)'
                },
                type: TooltipSyntax.Text,
                value: `### ccc 4\nThis tooltip 4`
            }
        ],
        pagination_mode: false,
        style_table: {
            max_height: '800px',
            height: '800px',
            max_width: '1000px',
            width: '1000px'
        },
        style_data_conditional: [
            { max_width: 150, min_width: 150, width: 150 },
            { if: { column_id: 'rows' }, max_width: 60, min_width: 60, width: 60 },
            { if: { column_id: 'bbb' }, max_width: 200, min_width: 200, width: 200 },
            { if: { column_id: 'bbb-readonly' }, max_width: 200, min_width: 200, width: 200 },
            { if: { column_id: 'ccc' }, background_color: '#FFE8E8' }
        ]
    };
}

function getDefaultState(): {
    filter: string,
    tableProps: Partial<PropsWithDefaults>
} {
    const mock = generateMockData(500);

    return {
        filter: '',
        tableProps: R.merge(getBaseTableProps(mock), {
            data: mock.data,
            editable: true,
            sorting: true,
            n_fixed_rows: 3,
            n_fixed_columns: 2,
            merge_duplicate_headers: false,
            row_deletable: true,
            row_selectable: 'single',
            content_style: ContentStyle.Fit,
            pagination_mode: 'fe'
        }) as Partial<PropsWithDefaults>
    };
}

function getReadonlyState() {
    const state = getDefaultState();
    state.tableProps.editable = false;
    state.tableProps.row_deletable = false;

    R.forEach(column => {
        column.editable = false;
    }, state.tableProps.columns || []);

    return state;
}

function getTypedState() {
    const state = getDefaultState();

    R.forEach(column => {
        (column as IVisibleColumn).on_change = {
            action: ChangeAction.Coerce,
            failure: ChangeFailure.Reject
        };
    }, state.tableProps.columns || []);

    return state;
}

function getVirtualizedState() {
    const mock = generateMockData(5000);

    return {
        filter: '',
        tableProps: R.merge(getBaseTableProps(mock), {
            data: mock.data,
            editable: true,
            sorting: true,
            merge_duplicate_headers: false,
            row_deletable: true,
            row_selectable: 'single',
            content_style: 'fit',
            virtualization: true
        })
    };
}

function getFixedVirtualizedState() {
    const mock = generateMockData(5000);

    return {
        filter: '',
        tableProps: R.merge(getBaseTableProps(mock), {
            data: mock.data,
            editable: true,
            sorting: true,
            n_fixed_rows: 3,
            n_fixed_columns: 2,
            merge_duplicate_headers: false,
            row_deletable: true,
            row_selectable: 'single',
            content_style: 'fit',
            virtualization: true
        })
    };
}

function getState() {
    const mode = Environment.searchParams.get('mode');

    switch (mode) {
        case AppMode.FixedVirtualized:
            return getFixedVirtualizedState();
        case AppMode.ReadOnly:
            return getReadonlyState();
        case AppMode.Virtualized:
            return getVirtualizedState();
        case AppMode.Typed:
            return getTypedState();
        case AppMode.Default:
        default:
            return getDefaultState();
    }
}
export default getState();
