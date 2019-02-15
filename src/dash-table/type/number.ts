import { format } from 'd3-format';
import isNumeric from 'fast-isnumeric';

import { INumberColumn } from 'dash-table/components/Table/props';
import { reconcileNull, isNully } from './null';
import { IReconciliation } from './reconcile';

export function coerce(value: any, options: INumberColumn | undefined): IReconciliation {
    return isNumeric(value) ?
        { success: true, value: +value } :
        reconcileNull(value, options);
}

export function getFormatter(options: INumberColumn | undefined) {
    if (!options || !options.formatting) {
        return;
    }

    return format(options.formatting);
}

export function validate(value: any, options: INumberColumn | undefined): IReconciliation {
    return typeof value === 'number' && !isNully(value) ?
        { success: true, value } :
        reconcileNull(value, options);
}