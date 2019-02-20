import * as R from 'ramda';
import { formatLocale } from 'd3-format';
import isNumeric from 'fast-isnumeric';

import { INumberColumn, LocaleFormat } from 'dash-table/components/Table/props';
import { reconcileNull, isNully } from './null';
import { IReconciliation } from './reconcile';

export function coerce(value: any, options: INumberColumn | undefined): IReconciliation {
    return isNumeric(value) ?
        { success: true, value: +value } :
        reconcileNull(value, options);
}

export function getFormatter(
    defaultLocale: LocaleFormat,
    options: INumberColumn | undefined
) {
    if (!options || !options.format) {
        return;
    }

    const locale = formatLocale(
        R.merge(
            defaultLocale,
            R.omit(['specifier', 'prefix'], options.format)
        )
    );

    return options.format.prefix ?
        locale.formatPrefix(options.format.specifier, options.format.prefix) :
        locale.format(options.format.specifier);
}

export function validate(value: any, options: INumberColumn | undefined): IReconciliation {
    return typeof value === 'number' && !isNully(value) ?
        { success: true, value } :
        reconcileNull(value, options);
}