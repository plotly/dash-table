import {
    ChangeAction,
    ChangeFailure,
    ColumnType,
    IColumnType
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

function getCoercer(c: IColumnType): (value: any, c?: any) => IReconciliation {
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

function getValidator(c: IColumnType): (value: any, c?: any) => IReconciliation {
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

function doAction(value: any, c: IColumnType) {
    const action = (c && c.on_change && c.on_change.action) || ChangeAction.None;

    switch (action) {
        case ChangeAction.Coerce:
            return { action, ...getCoercer(c)(value, c) };
        case ChangeAction.None:
            return { success: true, value, action };
        case ChangeAction.Validate:
            return { action, ...getValidator(c)(value, c) };
    }
}

function doFailureRecovery(result: IReconciliation, c: IColumnType) {
    // If c/v unsuccessful, process failure
    const failure = (c && c.on_change && c.on_change.failure) || ChangeFailure.Reject;
    result.failure = failure;

    // If Skip/Prevent
    if (failure !== ChangeFailure.Default) {
        return result;
    }

    // If Default, apply default
    result.success = true;
    result.value = c && c.validation && c.validation.default;

    return result;
}

export default (value: any, c: IColumnType) => {
    let res: IReconciliation = doAction(value, c);

    if (res.success) {
        return res;
    }

    return doFailureRecovery(res, c);
};