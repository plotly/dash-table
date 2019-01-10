import * as R from 'ramda';
import { getTypeOptions } from 'dash-table/coerce';
import { IVisibleColumn, VisibleColumns } from 'dash-table/components/Table/props';

export type Presentation = 'input' | 'dropdown' | undefined;

export default (
    columns: VisibleColumns
): Map<IVisibleColumn, Presentation> => new Map<IVisibleColumn, Presentation>(
    R.map<IVisibleColumn, [IVisibleColumn, Presentation]>(c => {
        const options = getTypeOptions(c);
        const presentation = options && options.presentation;

        return [c, presentation];
    }, columns)
);
