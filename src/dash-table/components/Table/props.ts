import { SortSettings } from 'core/sorting';

export type ActiveCell = CellCoordinates | [];
export type Columns = IColumn[];
export type Dataframe = Datum[];
export type Datum =  IDatumObject | any;
export type Filtering = 'fe' | 'be' | boolean;
export type Navigation = 'page';
export type CellCoordinates = [number, number];
export type SelectedCells = CellCoordinates[];
export type Sorting = 'fe' | 'be' | boolean;
export type Virtualization = 'fe' | 'be' | boolean;

interface IColumn {
    id: string | number;
    [key: string]: any;
}

interface IDatumObject {
    [key: string]: any;
}

export interface IVirtualizationSettings {
    displayed_pages: number;
    current_page: number;
    page_size: number;
}

interface IProps {
    dataframe_previous?: any[];
    dataframe_timestamp?: number;
    end_cell?: [number, number];
    is_focused?: boolean;
    start_cell?: [number, number];

    id: string;

    active_cell?: ActiveCell;
    columns?: Columns;
    column_conditional_dropdowns?: any[];
    column_conditional_styles?: any[];
    column_static_dropdown?: any;
    column_static_style?: any;
    dataframe?: Dataframe;
    editable?: boolean;
    filtering?: Filtering;
    filtering_settings?: string;
    merge_duplicate_headers?: boolean;
    navigation?: Navigation;
    n_fixed_columns?: number;
    n_fixed_rows?: number;
    row_conditional_styles?: any[];
    row_deletable?: boolean;
    row_selectable?: boolean;
    row_static_style?: any;
    selected_cell?: SelectedCells;
    selected_rows?: number[];
    setProps?: (...args: any[]) => any;
    sorting?: Sorting;
    sorting_settings?: SortSettings;
    table_style?: { selector: string, rule: string }[];
    virtualization?: Virtualization;
    virtualization_settings?: IVirtualizationSettings;
}

interface IDefaultProps {
    active_cell: ActiveCell;
    columns: Columns;
    column_conditional_dropdowns: any[];
    column_conditional_styles: any[];
    column_static_dropdown: any;
    column_static_style: any;
    dataframe: Dataframe;
    editable: boolean;
    filtering: Filtering;
    filtering_settings: string;
    merge_duplicate_headers: boolean;
    navigation: Navigation;
    n_fixed_columns: number;
    n_fixed_rows: number;
    row_conditional_styles: any[];
    row_deletable: boolean;
    row_selectable: boolean;
    row_static_style: any;
    selected_cell: SelectedCells;
    selected_rows: number[];
    sorting: Sorting;
    sorting_settings: SortSettings;
    table_style: { selector: string, rule: string }[];
    virtual_dataframe: any[];
    virtual_dataframe_indices: number[];
    virtualization: Virtualization;
    virtualization_settings: IVirtualizationSettings;
}

export type PropsWithDefaults = IProps & IDefaultProps;
