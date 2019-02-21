import * as R from 'ramda';

import { memoizeOne } from 'core/memoizer';

import { Columns, ColumnType, INumberLocale } from './components/Table/props';

const DEFAULT_LOCALE = {
    currency: ['$', ''],
    decimal: '.',
    thousands: ',',
    grouping: [3],
    percent: '%'
};

const DEFAULT_NULLY = '';

const applyDefaultToLocale = memoizeOne((locale: INumberLocale) =>
    R.merge(
        DEFAULT_LOCALE,
        locale
    )
);

const applyDefaultsToColumns = memoizeOne(
    (defaultLocale: INumberLocale, columns: Columns) => R.map(column => {
        if (column.type === ColumnType.Numeric && column.format) {
            column.format.locale = R.mergeAll([
                DEFAULT_LOCALE,
                defaultLocale,
                column.format.locale
            ]);
            column.format.nully = column.format.nully === undefined ?
                DEFAULT_NULLY :
                column.format.nully;
        }
        return column;
    }, columns)
);

export default (props: any) => {
    const locale_format = applyDefaultToLocale(props.locale_format);

    return R.mergeAll([
        props,
        {
            columns: applyDefaultsToColumns(locale_format, props.columns),
            locale_format
        }
    ]);
};