import * as R from 'ramda';
import { getTypeOptions } from 'dash-table/coerce';
import { IVisibleColumn, VisibleColumns, Presentation } from 'dash-table/components/Table/props';

export default (
    columns: VisibleColumns
): Map<IVisibleColumn, Presentation | undefined> => new Map<IVisibleColumn, Presentation | undefined>(
    R.map<IVisibleColumn, [IVisibleColumn, Presentation | undefined]>(c => {
        const options = getTypeOptions(c);
        const presentation = options && options.presentation;

        return [c, presentation];
    }, columns)
);
