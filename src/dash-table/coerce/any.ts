import { ICoerceResult } from 'dash-table/coerce';

export default (value: any, _options: any): ICoerceResult => {
    return { success: true, value };
};