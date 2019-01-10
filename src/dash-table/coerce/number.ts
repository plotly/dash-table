import { ICoerceResult, reconcile } from '.';
import { NumberValidationFailure, ValidationFailure, INumberTypeConfiguration } from 'dash-table/components/Table/props';

function coerceNumber(value: any, allowNaN: boolean): ICoerceResult {
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

function reconcileNumber(_value: any, action: NumberValidationFailure): ICoerceResult {
    return { success: true, value: NaN, action };
}

export default (value: any, options?: INumberTypeConfiguration): ICoerceResult => {
    const allowNaN = Boolean(options && options.validation && options.validation.allow_nan);
    const onFailure = (options && options.validation && options.validation.on_failure) || ValidationFailure.Passthrough;

    return reconcile(
        value,
        onFailure,
        () => coerceNumber(value, allowNaN),
        () => reconcileNumber(value, onFailure)
    );
};