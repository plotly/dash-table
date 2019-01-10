import { coerceData } from '.';
import { ValidationFailure, ITextTypeConfiguration } from 'dash-table/components/Table/props';

export function coerce(value: any, allowNully: boolean) {
    const isNully = value === undefined || value === null;
    return {
        success: !isNully || allowNully,
        value: isNully ? value : value.toString()
    };
}

export default (value: any, options?: ITextTypeConfiguration) => {
    const allowNully = Boolean(options && options.validation && options.validation.allow_nully);
    const onFailure = (options && options.validation && options.validation.on_failure) || ValidationFailure.Passthrough;

    return coerceData(
        value,
        onFailure,
        () => coerce(value, allowNully)
    );
};