import { SortBy } from 'core/sorting';
import { IPaginator } from 'dash-table/derived/paginator';
import {
    Table,
    BasicFilters,
    Cells,
    DataCells,
    Headers,
    Style
} from 'dash-table/derived/style/props';
import {
    ConditionalTooltip,
    Tooltip
} from 'dash-table/tooltips/props';
import { SingleColumnSyntaxTree } from 'dash-table/syntax-tree';
import { IConditionalElement, INamedElement } from 'dash-table/conditional';
import { Merge } from 'core/type';

export enum ColumnType {
    Any = 'any',
    Numeric = 'numeric',
    Text = 'text',
    Datetime = 'datetime'
}

export enum SortMode {
    Single = 'single',
    Multi = 'multi'
}

export enum TableAction {
    Custom = 'custom',
    Native = 'native',
    None = 'none'
}

export interface IDerivedData {
    data: Data;
    indices: Indices;
}

export interface IViewportOffset {
    rows: number;
    columns: number;
}

export interface IViewportPadding {
    before: number;
    after: number;
}

export interface IVirtualizedDerivedData extends IDerivedData {
    offset: IViewportOffset;
    padding: {
        rows: IViewportPadding;
    };
}

export interface ICellCoordinates {
    row: number;
    column: number;
    row_id?: RowId;
    column_id: ColumnId;
}

export type ColumnId = string;
export type Columns = IColumn[];
export type Data = Datum[];
export type Datum =  IDatumObject | any;
export type Indices = number[];
export type RowId = string | number;
export type RowSelection = 'single' | 'multi' | false;
export type SelectedCells = ICellCoordinates[];
export type SetProps = (...args: any[]) => void;
export type SetState = (state: Partial<IState>) => void;
export type SortAsNone = (string | number | boolean)[];
export type VisibleColumns = IVisibleColumn[];

export enum ChangeAction {
    Coerce = 'coerce',
    None = 'none',
    Validate = 'validate'
}

export enum ChangeFailure {
    Default = 'default',
    Accept = 'accept',
    Reject = 'reject'
}

export enum Presentation {
    Dropdown = 'dropdown',
    Input = 'input'
}

export interface IChangeOptions {
    action?: ChangeAction;
    failure?: ChangeFailure;
}

export interface IAnyColumn {
    on_change?: undefined;
    presentation?: Presentation.Input | Presentation.Dropdown;
    type?: ColumnType.Any;
    validation?: undefined;
}

export interface ITypeValidation {
    allow_null?: boolean;
    default?: null | number;
}

export interface ITypeColumn {
    on_change?: IChangeOptions;
    validation?: ITypeValidation;
}

export interface INumberLocale {
    symbol: [string, string];
    decimal: string;
    group: string;
    grouping: number[];
    numerals?: string[];
    percent: string;
    separate_4digits?: boolean;
}

export type NumberFormat = ({
    locale: INumberLocale;
    nully: any;
    prefix?: number;
    specifier: string;
}) | undefined;

export interface INumberColumn extends ITypeColumn {
    format?: NumberFormat;
    presentation?: Presentation.Input | Presentation.Dropdown;
    type: ColumnType.Numeric;
}

export interface ITextColumn extends ITypeColumn {
    presentation?: Presentation.Input | Presentation.Dropdown;
    type: ColumnType.Text;
}

export interface IDateValidation extends ITypeValidation {
    allow_YY?: boolean;
}

export interface IDatetimeColumn extends ITypeColumn {
    presentation?: Presentation.Input | Presentation.Dropdown;
    type: ColumnType.Datetime;
    validation?: IDateValidation;
}

export interface IBaseVisibleColumn {
    deletable?: boolean | boolean[];
    editable?: boolean;
    renamable?: boolean | boolean[];
    sort_as_none: SortAsNone;
    id: ColumnId;
    name: string | string[];
}

export type Fixed = { headers: false, data?: 0 } | { headers: true, data?: number };
export type IColumnType = INumberColumn | ITextColumn | IDatetimeColumn | IAnyColumn;
export type IVisibleColumn = IBaseVisibleColumn & IColumnType;

export type IColumn = IVisibleColumn & {
    hidden?: boolean;
};

interface IDatumObject {
    [key: string]: any;
}

export interface IDropdownValue {
    label: string;
    value: string | number;
}

export type DropdownValues = IDropdownValue[];

export interface IDropdown {
    clearable?: boolean;
    dropdown: DropdownValues;
}

export interface IConditionalDropdown extends IDropdown {
    if: Partial<IConditionalElement & INamedElement>;
}

export type ConditionalDropdowns = IConditionalDropdown[];

export interface IDataDropdowns {
    [key: string]: (IDropdown | undefined)[];
}

export interface IStaticDropdowns {
    [key: string]: IDropdown;
}

export interface ITableTooltips {
    [key: string]: Tooltip[];
}

export interface ITableStaticTooltips {
    [key: string]: Tooltip;
}

interface IStylesheetRule {
    selector: string;
    rule: string;
}

export interface IUserInterfaceCell {
    height: number;
}

export interface IUserInterfaceViewport {
    scrollLeft: number;
    scrollTop: number;
    height: number;
    width: number;
}

export interface IUSerInterfaceTooltip {
    delay?: number;
    duration?: number;
    id: ColumnId;
    row: number;
}

export interface IState {
    currentTooltip?: IUSerInterfaceTooltip;
    forcedResizeOnly: boolean;
    rawFilterQuery: string;
    scrollbarWidth: number;
    uiCell?: IUserInterfaceCell;
    uiHeaders?: IUserInterfaceCell[];
    uiViewport?: IUserInterfaceViewport;
    workFilter: {
        value: string,
        map: Map<string, SingleColumnSyntaxTree>
    };
}

export type StandaloneState = IState & Partial<SanitizedAndDerivedProps>;

export interface IProps {
    data_previous?: any[];
    data_timestamp?: number;
    end_cell?: ICellCoordinates;
    is_focused?: boolean;
    start_cell?: ICellCoordinates;

    id: string;

    tooltip_data?: ITableTooltips;
    tooltip_delay: number | null;
    tooltip_duration: number | null;
    tooltip: ITableStaticTooltips;
    tooltip_conditional: ConditionalTooltip[];

    active_cell?: ICellCoordinates;
    columns?: Columns;
    dropdown?: IStaticDropdowns;
    dropdown_conditional?: ConditionalDropdowns;
    dropdown_data: IDataDropdowns;
    css?: IStylesheetRule[];
    data?: Data;
    editable?: boolean;
    filter_query?: string;
    filter_action?: TableAction;
    locale_format: INumberLocale;
    merge_duplicate_headers?: boolean;
    fixed_columns?: Fixed;
    fixed_rows?: Fixed;
    row_deletable?: boolean;
    row_selectable?: RowSelection;
    selected_cells?: SelectedCells;
    selected_rows?: Indices;
    selected_row_ids?: RowId[];
    setProps?: SetProps;
    sort_action?: TableAction;
    sort_by?: SortBy;
    sort_mode?: SortMode;
    sort_as_none?: SortAsNone;
    style_as_list_view?: boolean;
    page_action?: TableAction;
    page_current?: number;
    page_size: number;

    style_data?: Style;
    style_cell?: Style;
    style_filter?: Style;
    style_header?: Style;

    style_data_conditional?: DataCells;
    style_cell_conditional?: Cells;
    style_filter_conditional?: BasicFilters;
    style_header_conditional?: Headers;
    style_table?: Table;
    virtualization?: boolean;
}

interface IDefaultProps {
    active_cell: ICellCoordinates;
    columns: Columns;
    dropdown: IStaticDropdowns;
    dropdown_conditional: ConditionalDropdowns;
    dropdown_data: IDataDropdowns;
    css: IStylesheetRule[];
    data: Data;
    editable: boolean;
    filter_query: string;
    filter_action: TableAction;
    merge_duplicate_headers: boolean;
    fixed_columns: Fixed;
    fixed_rows: Fixed;
    row_deletable: boolean;
    row_selectable: RowSelection;
    selected_cells: SelectedCells;
    start_cell: ICellCoordinates;
    end_cell: ICellCoordinates;
    selected_rows: Indices;
    selected_row_ids: RowId[];
    sort_action: TableAction;
    sort_by: SortBy;
    sort_mode: SortMode;
    sort_as_none: SortAsNone;
    style_as_list_view: boolean;

    page_action: TableAction;
    page_current: number;
    page_size: number;

    style_data: Style;
    style_cell: Style;
    style_filter: Style;
    style_header: Style;

    style_data_conditional: DataCells;
    style_cell_conditional: Cells;
    style_filter_conditional: BasicFilters;
    style_header_conditional: Headers;

    style_table: Table;
    virtualization: boolean;
}

interface IDerivedProps {
    derived_filter_structure: object | null;
    derived_viewport_data: Data;
    derived_viewport_indices: Indices;
    derived_viewport_row_ids: RowId[];
    derived_viewport_selected_rows: Indices;
    derived_viewport_selected_row_ids: RowId[];
    derived_virtual_data: Data;
    derived_virtual_indices: Indices;
    derived_virtual_row_ids: RowId[];
    derived_virtual_selected_rows: Indices;
    derived_virtual_selected_row_ids: RowId[];
}

export type PropsWithDefaults = IProps & IDefaultProps;

export type SanitizedProps = Omit<
    Omit<
        Merge<PropsWithDefaults, { fixed_columns: number; fixed_rows: number; }>,
        'locale_format'
    >,
    'sort_as_none'
>;

export type SanitizedAndDerivedProps = SanitizedProps & IDerivedProps;

export type ControlledTableProps = SanitizedProps & IState & {
    setProps: SetProps;
    setState: SetState;

    columns: VisibleColumns;
    currentTooltip: IUSerInterfaceTooltip;
    paginator: IPaginator;
    viewport: IDerivedData;
    viewport_selected_rows: Indices;
    virtual: IDerivedData;
    virtual_selected_rows: Indices;
    virtualized: IVirtualizedDerivedData;
};

export interface ICellFactoryProps {
    active_cell: ICellCoordinates;
    columns: VisibleColumns;
    dropdown: IStaticDropdowns;
    dropdown_conditional: ConditionalDropdowns;
    dropdown_data: IDataDropdowns;
    tooltip: ITableStaticTooltips;
    currentTooltip: IUSerInterfaceTooltip;
    data: Data;
    editable: boolean;
    id: string;
    is_focused?: boolean;
    fixed_columns: number;
    fixed_rows: number;
    paginator: IPaginator;
    row_deletable: boolean;
    row_selectable: RowSelection;
    selected_cells: SelectedCells;
    start_cell: ICellCoordinates;
    end_cell: ICellCoordinates;
    selected_rows: Indices;
    setProps: SetProps;
    setState: SetState;
    style_cell: Style;
    style_data: Style;
    style_filter: Style;
    style_header: Style;
    style_cell_conditional: Cells;
    style_data_conditional: DataCells;
    style_filter_conditional: BasicFilters;
    style_header_conditional: Headers;
    style_table: Table;
    tooltip_data?: ITableTooltips;
    uiCell?: IUserInterfaceCell;
    uiViewport?: IUserInterfaceViewport;
    viewport: IDerivedData;
    virtualization: boolean;
    virtualized: IVirtualizedDerivedData;
}
