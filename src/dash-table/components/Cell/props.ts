import { CSSProperties } from 'react';

import {
    ColumnId,
    ColumnType,
    Datum
} from 'dash-table/components/Table/props';

export interface ICellProps {
    active: boolean;
    classes: string;
    datum: Datum;
    editable: boolean;
    property: ColumnId;
    selected: boolean;
    style?: CSSProperties;
    tableId: string;
    type?: string;
}

export interface ICellDefaultProps {
    type: ColumnType;
}

export interface ICellState {
    value: any;
}

export type ICellPropsWithDefaults = ICellProps & ICellDefaultProps;
