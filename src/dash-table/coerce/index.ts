import {
    ColumnType,
    ChangeValidation,
    IVisibleColumn
} from 'dash-table/components/Table/props';

import coerceAny from './any';
import coerceNumber from './number';
import coerceText from './text';

export interface ICoerceResult {
    action?: ChangeValidation | any;
    success: boolean;
    value?: any;
}

export function coerceData(value: any, action: any, c: () => ICoerceResult, r?: () => ICoerceResult) {
    const result = c();
    if (result.success) {
        return result;
    }

    switch (action) {
        case ChangeValidation.Passthrough:
            return { success: true, value, action };
        case ChangeValidation.Prevent:
        case ChangeValidation.Skip:
            return { success: false, value, action };
        default:
            return r ? r() : { success: false, value, action };

    }
}

export default (value: any, c: IVisibleColumn) => {
    let coercer;
    switch (c.type) {
        case ColumnType.Number:
            coercer = coerceNumber;
        case ColumnType.Text:
            coercer = coerceText;
        case ColumnType.Any:
        default:
            coercer = coerceAny;
    }

    return coercer(value, getTypeOptions(c));
};

export function getTypeOptions(c: IVisibleColumn) {
    switch (c.type) {
        case ColumnType.Number:
            return c.number;
        case ColumnType.Text:
            return c.text;
        case ColumnType.Any:
        default:
            return;
    }
}