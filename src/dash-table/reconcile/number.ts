import { INumberColumn } from 'dash-table/components/Table/props';

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
    const allowNaN = Boolean(options && options.validation && options.validation.allow_nan);
    const allowNully = Boolean(options && options.validation && options.validation.allow_nully);

    const isNully = value === undefined || value === null;
    if (isNully && allowNully) {
        return { success: true, value };
    }

    if (typeof value === 'number') {
        return { success: Boolean(!isNaN(value) || allowNaN), value };
    } else {
        return { success: false, value };
    }
}