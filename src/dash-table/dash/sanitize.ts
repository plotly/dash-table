
import * as R from 'ramda';

import { memoizeOne } from 'core/memoizer';
import {
    Columns,
    ColumnType,
    Filtering,
    Fixed,
    IColumn,
    INumberLocale,
    PropsWithDefaults,
    RowSelection,
    SanitizedProps,
    SortAsNone
} from 'dash-table/components/Table/props';
import headerRows from 'dash-table/derived/header/headerRows';

const D3_DEFAULT_LOCALE: INumberLocale = {
    symbol: ['$', ''],
    decimal: '.',
    group: ',',
    grouping: [3],
    percent: '%',
    separate_4digits: true
};

const DEFAULT_NULLY = '';
const DEFAULT_SPECIFIER = '';

const applyDefaultToLocale = memoizeOne((locale: INumberLocale) => getLocale(locale));

const applyDefaultsToColumns = memoizeOne(
    (defaultLocale: INumberLocale, defaultSort: SortAsNone, columns: Columns) => R.map(column => {
        const c = R.clone(column);

        if (c.type === ColumnType.Numeric && c.format) {
            c.sort_as_none = c.sort_as_none || defaultSort;
            c.format.locale = getLocale(defaultLocale, c.format.locale);
            c.format.nully = getNully(c.format.nully);
            c.format.specifier = getSpecifier(c.format.specifier);
        }
        return c;
    }, columns)
);

const data2number = (data?: any) => +data || 0;

const getFixedColumns = (
    fixed: Fixed,
    row_deletable: boolean,
    row_selectable: RowSelection
) => !fixed.headers ?
        0 :
        (row_deletable ? 1 : 0) + (row_selectable ? 1 : 0) + data2number(fixed.data);

const getFixedRows = (
    fixed: Fixed,
    columns: IColumn[],
    filter: Filtering
) => !fixed.headers ?
        0 :
        headerRows(columns) + (filter ? 1 : 0) + data2number(fixed.data);

export default (props: PropsWithDefaults): SanitizedProps => {
    const locale_format = applyDefaultToLocale(props.locale_format);

    return R.merge(props, {
        columns: applyDefaultsToColumns(locale_format, props.sort_as_none, props.columns),
        fixed_columns: getFixedColumns(props.fixed_columns, props.row_deletable, props.row_selectable),
        fixed_rows: getFixedRows(props.fixed_rows, props.columns, props.filtering),
        locale_format
    });
};

export const getLocale = (...locales: Partial<INumberLocale>[]): INumberLocale =>
    R.mergeAll([
        D3_DEFAULT_LOCALE,
        ...locales
    ]) as INumberLocale;

export const getSpecifier = (specifier?: string) => specifier === undefined ?
    DEFAULT_SPECIFIER :
    specifier;

export const getNully = (nully?: any) => nully === undefined ?
    DEFAULT_NULLY :
    nully;