import { INumberColumn } from 'dash-table/components/Table/props';
import isNully from './isNully';

export function coerce(value: any, options?: INumberColumn) {
    const validation = validate(value, options);
    if (validation.success) {
        return validation;
    }

    switch (typeof value) {
        case 'string':
            return { success: Boolean(/(-)?\d+([.]\d+)?/.test(value)), value: parseFloat(value) };
        default:
            return { success: false, value };
    }
}

export function validate(value: any, options?: INumberColumn) {
    const allowNull = Boolean(options && options.validation && options.validation.allow_null);

    const nully = isNully(value);
    if (nully && allowNull) {
        return { success: true, value: null };
    }

    value = nully ? null : value;

    if (typeof value === 'number') {
        return { success: !nully, value };
    } else {
        return { success: false, value };
    }
}