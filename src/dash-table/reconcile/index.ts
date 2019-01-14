import {
    ChangeAction,
    ChangeFailure,
    ColumnType,
    IVisibleColumn
} from 'dash-table/components/Table/props';

import reconcileAny from './any';
import { coerce as coerceNumber, validate as validateNumber } from './number';
import { coerce as coerceText, validate as validateText } from './text';

export interface IReconciliation {
    action?: ChangeAction;
    failure?: ChangeFailure;
    success: boolean;
    value?: any;
}

export default (value: any, c: IVisibleColumn) => {
    const config = getConfiguration(c);
    const options = config && config.validation;
    const action = (config && config.on_change && config.on_change.action) || ChangeAction.Passthrough;

    // Coerce or validate
    let res;
    switch (action) {
        case ChangeAction.Coerce:
            res = { action, ...(getCoercer(c) as any)(value, options) };
            break;
        case ChangeAction.Passthrough:
            res = { success: true, value, action };
            break;
        case ChangeAction.Validate:
            res = { action, ...(getValidator(c) as any)(value, options) };
            break;
    }

    if (res.success) {
        return res;
    }

    // If c/v unsuccessful, process failure
    const failure = (config && config.on_change && config.on_change.failure) || ChangeFailure.Skip;
    res.failure = failure;

    // If Skip/Prevent
    if (failure !== ChangeFailure.Default) {
        return res;
    }

    // If Default, apply default
    res.success = true;
    res.value = config && config.validation && config.validation.default;

    return res;
};

function getCoercer(c: IVisibleColumn) {
    switch (c.type) {
        case ColumnType.Number:
            return coerceNumber;
        case ColumnType.Text:
            return coerceText;
        case ColumnType.Any:
        default:
            return reconcileAny;
    }
}

function getValidator(c: IVisibleColumn) {
    switch (c.type) {
        case ColumnType.Number:
            return validateNumber;
        case ColumnType.Text:
            return validateText;
        case ColumnType.Any:
        default:
            return reconcileAny;
    }
}

export function getConfiguration(c: IVisibleColumn) {
    switch (c.type) {
        case ColumnType.Number:
            return c.number;
        case ColumnType.Text:
            return c.text;
        case ColumnType.Any:
        default:
            return;
    }
}