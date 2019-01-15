import { ITextColumn } from 'dash-table/components/Table/props';
import isNully from './isNully';

export function coerce(value: any, options?: ITextColumn) {
    const validation = validate(value, options);
    if (validation.success) {
        return validation;
    }

    const allowNull = Boolean(options && options.validation && options.validation.allow_null);
    const nully = isNully(value);

    return {
        success: Boolean(!nully || allowNull),
        value: nully ? value : JSON.stringify(value)
    };
}

export function validate(value: any, options?: ITextColumn) {
    const allowNull = Boolean(options && options.validation && options.validation.allow_null);

    const nully = isNully(value);
    if (nully && allowNull) {
        return { success: true, value: null };
    }

    value = nully ? null : value;

    if (typeof value === 'string') {
        return { success: true, value };
    } else {
        return { success: false, value };
    }
}