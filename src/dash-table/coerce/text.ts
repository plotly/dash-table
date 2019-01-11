import { coerceData } from '.';
import { ChangeValidation, ITextTypeConfiguration } from 'dash-table/components/Table/props';

export function coerce(value: any, allowNully: boolean) {
    if (typeof value === 'string') {
        return { success: true, value };
    }

    const isNully = value === undefined || value === null;
    return {
        success: !isNully || allowNully,
        value: isNully ? value : value.toString()
    };
}

export default (value: any, options?: ITextTypeConfiguration) => {
    const allowNully = Boolean(options && options.validation && options.validation.allow_nully);
    const onChange = (options && options.validation && options.validation.on_change) || ChangeValidation.Passthrough;

    return coerceData(
        value,
        onChange,
        () => coerce(value, allowNully)
    );
};