import { ICoerceResult, reconcile } from '.';
import { TextValidationFailure, ValidationFailure, ITextTypeConfiguration } from 'dash-table/components/Table/props';

function coerceText(value: any, allowNully: boolean) {
    return {
        success: (value !== undefined && value !== null) || allowNully,
        value: value.toString()
    };
}

function reconcileText(value: any, action: TextValidationFailure) {
    return action === ValidationFailure.Passthrough ?
        { success: true, value, action } :
        { success: false, action };
}

export default (value: any, options?: ITextTypeConfiguration): ICoerceResult => {
    const allowNully = Boolean(options && options.validation && options.validation.allow_nully);
    const onFailure = (options && options.validation && options.validation.on_failure) || ValidationFailure.Passthrough;

    return reconcile(
        value,
        onFailure,
        () => coerceText(value, allowNully),
        () => reconcileText(value, onFailure)
    );
};