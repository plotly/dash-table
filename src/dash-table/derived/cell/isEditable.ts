import { IVisibleColumn } from 'dash-table/components/Table/props';

export default (
    editable: boolean,
    column: IVisibleColumn
) => editable && (column.editable === undefined || column.editable);