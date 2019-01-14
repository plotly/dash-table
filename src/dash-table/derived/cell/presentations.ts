import * as R from 'ramda';
import { getConfiguration } from 'dash-table/reconcile';
import { IVisibleColumn, VisibleColumns, Presentation } from 'dash-table/components/Table/props';

export default (
    columns: VisibleColumns
): Map<IVisibleColumn, Presentation | undefined> => new Map<IVisibleColumn, Presentation | undefined>(
    R.map<IVisibleColumn, [IVisibleColumn, Presentation | undefined]>(c => {
        const config = getConfiguration(c);

        const presentation = config && config.presentation;

        return [c, presentation];
    }, columns)
);
