import { formatLocale } from 'd3-format';
import isNumeric from 'fast-isnumeric';

import { INumberColumn, NumberFormat } from 'dash-table/components/Table/props';
import { reconcileNull, isNully } from './null';
import { IReconciliation } from './reconcile';

export function coerce(value: any, options: INumberColumn | undefined): IReconciliation {
    return isNumeric(value) ?
        { success: true, value: +value } :
        reconcileNull(value, options);
}

export function getFormatter(format: NumberFormat) {
    if (!format) {
        return (value: any) => value;
    }

    const locale = formatLocale(format.locale);

    const numberFormatter = format.prefix ?
        locale.formatPrefix(format.specifier, format.prefix) :
        locale.format(format.specifier);

    return (value: any) => {
        if (isNully(value)) {
            return typeof format.nully === 'number' ?
                numberFormatter(format.nully) :
                format.nully;
        } else if (typeof value === 'number') {
            return numberFormatter(value);
        } else {
            return value;
        }
    };
}

export function validate(value: any, options: INumberColumn | undefined): IReconciliation {
    return typeof value === 'number' && !isNully(value) ?
        { success: true, value } :
        reconcileNull(value, options);
}