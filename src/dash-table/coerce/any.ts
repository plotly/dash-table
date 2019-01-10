import { ICoerceResult } from 'dash-table/coerce';

export default (value: any): ICoerceResult => {
    return { success: true, value };
};