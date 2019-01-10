import {
    ColumnType,
    ValidationFailure,
    IVisibleColumn
} from 'dash-table/components/Table/props';

import coerceAny from './any';
import coerceNumber from './number';
import coerceText from './text';

export interface ICoerceResult {
    action?: ValidationFailure | any;
    success: boolean;
    value?: any;
}

export function reconcile(value: any, action: any, c: () => ICoerceResult, r: () => ICoerceResult) {
    const result = c();
    if (result.success) {
        return result;
    }

    switch (action) {
        case ValidationFailure.Passthrough:
            return { success: true, value, action };
        case ValidationFailure.Prevent:
        case ValidationFailure.Skip:
            return { success: false, value, action };
        default:
            return r();

    }
}

export default (value: any, c: IVisibleColumn) => {
    switch (c.type) {
        case ColumnType.Number:
            return coerceNumber(value, c.number);
        case ColumnType.Text:
            return coerceText(value, c.text);
        case ColumnType.Any:
        default:
            return coerceAny(value);
    }
};