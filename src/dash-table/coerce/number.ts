import { coerceData } from '.';
import { NumberChangeValidation, ChangeValidation, INumberTypeConfiguration } from 'dash-table/components/Table/props';

export function coerce(value: any, allowNaN: boolean) {
    const type = typeof value;

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

export function reconcile(_value: any, action: NumberChangeValidation) {
    return { success: true, value: NaN, action };
}

export default (value: any, options?: INumberTypeConfiguration) => {
    const allowNaN = Boolean(options && options.validation && options.validation.allow_nan);
    const onChange = (options && options.validation && options.validation.on_change) || ChangeValidation.Passthrough;

    return coerceData(
        value,
        onChange,
        () => coerce(value, allowNaN),
        () => reconcile(value, onChange)
    );
};