import { ITextOptions } from 'dash-table/components/Table/props';

export function coerce(value: any, options?: ITextOptions) {
    const validation = validate(value, options);
    if (validation.success) {
        return validation;
    }

    const allowNully = Boolean(options && options.allow_nully);
    const isNully = value === undefined || value === null;

    return {
        success: Boolean(!isNully || allowNully),
        value: isNully ? value : JSON.stringify(value)
    };
}

export function validate(value: any, options?: ITextOptions) {
    const allowNully = Boolean(options && options.allow_nully);

    const isNully = value === undefined || value === null;
    if (isNully && allowNully) {
        return { success: true, value };
    }

    if (typeof value === 'string') {
        return { success: true, value };
    } else {
        return { success: false, value };
    }
}