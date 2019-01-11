import { coerceData } from '.';
import { NumberChangeValidation, ChangeValidation, INumberTypeConfiguration } from 'dash-table/components/Table/props';

export function coerce(value: any, allowNaN: boolean, allowNully: boolean) {
    const type = typeof value;

    const isNully = value === undefined || value === null;
    if (isNully && allowNully) {
        return { success: true, value };
    }

    switch (type) {
        case 'number':
            return {
                success: !isNaN(value) || allowNaN,
                value
            };
        case 'string':
            return { success: /(-)?\d+([.]\d+)?/.test(value), value: parseFloat(value) };
        default:
            return { success: false, value };
    }
}

export function reconcile(value: any, allowNully: boolean, action: NumberChangeValidation) {
    const isNully = value === undefined || value === null;

    return {
        success: !isNully || allowNully,
        value: NaN,
        action
    };
}

export default (value: any, options?: INumberTypeConfiguration) => {
    const allowNaN = Boolean(options && options.validation && options.validation.allow_nan);
    const allowNully = Boolean(options && options.validation && options.validation.allow_nully);
    const onChange = (options && options.validation && options.validation.on_change) || ChangeValidation.Passthrough;

    return coerceData(
        value,
        onChange,
        () => coerce(value, allowNaN, allowNully),
        () => reconcile(value, allowNully, onChange)
    );
};