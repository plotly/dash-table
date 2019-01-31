import { IDatetimeColumn } from 'dash-table/components/Table/props';
import { reconcileNull } from './null';
import { IReconciliation } from '.';

// pattern and convertToMs pulled from plotly.js
// (simplified - no international calendars for now)
// https://github.com/plotly/plotly.js/blob/master/src/lib/dates.js
// Note we allow timezone info but ignore it - at least for now.
const DATETIME_REGEXP = /^\s*(-?\d\d\d\d|\d\d)(-(\d?\d)(-(\d?\d)([ Tt]([01]?\d|2[0-3])(:([0-5]\d)(:([0-5]\d(\.\d+)?))?(Z|z|[+\-]\d\d:?\d\d)?)?)?)?)?\s*$/m;

const ONESEC = 1000;

// for 2-digit years, the first year we map them onto
// Also pulled from plotly.js - see discussion there for details
// Please don't use 2-digit years!
const YFIRST = new Date().getFullYear() - 70;

export function convertToMs(value: any): number | null {
    // stringify numbers, in case of a year as a number
    const stringVal = typeof value === 'number' ? String(value) : value;
    if (typeof stringVal !== 'string') {
        return null;
    }

    const match = stringVal.match(DATETIME_REGEXP);
    if (!match) {
        return null;
    }

    const yStr = match[1];
    const y = yStr.length === 2 ?
        (Number(yStr) + 2000 - YFIRST) % 100 + YFIRST :
        Number(yStr);

    // js Date objects have months 0-11, not 1-12
    const m = Number(match[3] || '1') - 1;

    const d = Number(match[5] || 1);
    const H = Number(match[7] || 0);
    const M = Number(match[9] || 0);

    // includes fractional seconds
    const S = Number(match[11] || 0);

    // javascript takes new Date(0..99,m,d) to mean 1900-1999, so
    // to support years 0-99 we need to use setFullYear explicitly
    // Note that 2000 is a leap year.
    const date = new Date(Date.UTC(2000, m, d, H, M));
    date.setUTCFullYear(y);

    // The regexp catches most faulty dates & times, but invalid month/day
    // combinations will show up here
    if ((date.getUTCMonth() !== m) || (date.getUTCDate() !== d)) {
        return null;
    }

    return date.getTime() + S * ONESEC;
}

export function coerce(value: any, options: IDatetimeColumn | undefined): IReconciliation {
    return convertToMs(value) !== null ?
        {
            success: true,
            // TODO: also convert to 4-digit year and 2-digit month & day?
            value: String(value).trim()
        } :
        reconcileNull(value, options);
}

export function validate(value: any, options: IDatetimeColumn | undefined): IReconciliation {
    return (typeof value === 'string') && (convertToMs(value) !== null) ?
        { success: true, value: value.trim() } :
        reconcileNull(value, options);
}
