import { ColumnId } from 'dash-table/components/Table/props';

export interface IConditionalElement {
    filter?: string;
}

export interface IIndexedHeaderElement {
    header_index?: number | 'odd' | 'even';
}

export interface IIndexedRowElement {
    row_index?: number | 'odd' | 'even';
}

export interface INamedElement {
    column_id?: ColumnId;
}

export type ConditionalBasicFilter = INamedElement;
export type ConditionalDataCell = IConditionalElement & IIndexedRowElement & INamedElement;
export type ConditionalCell = INamedElement;
export type ConditionalHeader = IIndexedHeaderElement & INamedElement;