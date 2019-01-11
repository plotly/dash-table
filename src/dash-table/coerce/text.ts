import { coerceData } from '.';
import { ChangeValidation, ITextTypeConfiguration, TextChangeValidation } from 'dash-table/components/Table/props';

export function coerce(value: any, allowNully: boolean) {
    if (typeof value === 'string') {
        return { success: true, value };
    }

    const isNully = value === undefined || value === null;
    if (isNully && allowNully) {
        return { success: true, value };
    }

    return {
        success: false,
        value: value
    };
}

export function reconcile(value: any, allowNully: boolean, action: TextChangeValidation) {
    const isNully = value === undefined || value === null;

    return {
        success: !isNully || allowNully,
        value: isNully ? value : value.toString(),
        action
    };
}

export default (value: any, options?: ITextTypeConfiguration) => {
    const allowNully = Boolean(options && options.validation && options.validation.allow_nully);
    const onChange = (options && options.validation && options.validation.on_change) || ChangeValidation.Passthrough;

    return coerceData(
        value,
        onChange,
        () => coerce(value, allowNully),
        () => reconcile(value, allowNully, onChange)
    );
};