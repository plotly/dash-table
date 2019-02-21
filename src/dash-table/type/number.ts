import * as R from 'ramda';
import { formatLocale } from 'd3-format';
import isNumeric from 'fast-isnumeric';

import { INumberColumn, LocaleFormat, NumberFormat } from 'dash-table/components/Table/props';
import { reconcileNull, isNully } from './null';
import { IReconciliation } from './reconcile';

const DEFAULT_LOCALE = {
    currency: ['$', ''],
    decimal: '.',
    thousands: ',',
    grouping: [3],
    percent: '%'
};
const DEFAULT_NULLY = '';

export function coerce(value: any, options: INumberColumn | undefined): IReconciliation {
    return isNumeric(value) ?
        { success: true, value: +value } :
        reconcileNull(value, options);
}

export function getFormatter(
    defaultLocale: LocaleFormat,
    format: NumberFormat
) {
    if (!format) {
        return;
    }

    const locale = formatLocale(
        R.mergeAll([
            DEFAULT_LOCALE,
            defaultLocale,
            format.locale
        ])
    );

    const numberFormatter = format.prefix ?
        locale.formatPrefix(format.specifier, format.prefix) :
        locale.format(format.specifier);

    const nully = typeof format.nully === 'undefined' ?
        DEFAULT_NULLY :
        format.nully;

    return (value: any) => {
        if (isNully(value)) {
            return typeof nully === 'number' ?
                numberFormatter(nully) :
                nully;
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