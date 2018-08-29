import { SortSettings } from 'core/sorting';

export interface IProps {
    dataframe_previous?: any[];
    dataframe_timestamp?: number;
    end_cell?: [number, number];
    is_focused?: boolean;
    start_cell?: [number, number];

    id: string;

    active_cell?: [number, number] | [];
    columns?: any[];
    column_conditional_dropdowns?: any[];
    column_conditional_styles?: any[];
    column_static_dropdown?: any;
    column_static_style?: any;
    dataframe?: any[];
    editable?: boolean;
    filtering?: 'fe' | 'be' | boolean;
    filtering_settings?: string;
    merge_duplicate_headers?: boolean;
    navigation?: 'page';
    n_fixed_columns?: number;
    n_fixed_rows?: number;
    row_conditional_styles?: any[];
    row_deletable?: boolean;
    row_selectable?: boolean;
    row_static_style?: any;
    selected_cell?: [number, number][];
    selected_rows?: number[];
    setProps?: (...args: any[]) => any;
    sorting?: 'fe' | 'be' | boolean;
    sorting_settings?: SortSettings;
    table_style?: { selector: string, rule: string }[];
    virtualization?: 'fe' | 'be' | boolean;
    virtualization_settings?: { displayed_pages: number, current_page: number, page_size: number };
}

export interface IDefaultProps {
    active_cell: [number, number] | [];
    columns: any[];
    column_conditional_dropdowns: any[];
    column_conditional_styles: any[];
    column_static_dropdown: any;
    column_static_style: any;
    dataframe: (object | [])[];
    editable: boolean;
    filtering: 'fe' | 'be' | boolean;
    filtering_settings: string;
    merge_duplicate_headers: boolean;
    navigation: 'page';
    n_fixed_columns: number;
    n_fixed_rows: number;
    row_conditional_styles: any[];
    row_deletable: boolean;
    row_selectable: boolean;
    row_static_style: any;
    selected_cell: [number, number][];
    selected_rows: number[];
    sorting: 'fe' | 'be' | boolean;
    sorting_settings: SortSettings;
    table_style: { selector: string, rule: string }[];
    virtual_dataframe: any[];
    virtual_dataframe_indices: number[];
    virtualization: 'fe' | 'be' | boolean;
    virtualization_settings: { displayed_pages: number, current_page: number, page_size: number };
}

export type PropsWithDefaults = IProps & IDefaultProps;
