import * as R from 'ramda';
import { formatLocale } from 'd3-format';
import isNumeric from 'fast-isnumeric';

import { INumberColumn } from 'dash-table/components/Table/props';
import { reconcileNull, isNully } from './null';
import { IReconciliation } from './reconcile';

const DEFAULT_LOCALE = {
    decimal: '.',
    thousands: '',
    grouping: [3],
    currency: ['$', '']
};

export function coerce(value: any, options: INumberColumn | undefined): IReconciliation {
    return isNumeric(value) ?
        { success: true, value: +value } :
        reconcileNull(value, options);
}

export function getFormatter(options: INumberColumn | undefined) {
    if (!options || !options.format) {
        return;
    }

    return formatLocale(
        R.merge(
            DEFAULT_LOCALE,
            R.omit(['specifier'], options.format || {})
        )
    ).format(options.format.specifier);
}

export function validate(value: any, options: INumberColumn | undefined): IReconciliation {
    return typeof value === 'number' && !isNully(value) ?
        { success: true, value } :
        reconcileNull(value, options);
}