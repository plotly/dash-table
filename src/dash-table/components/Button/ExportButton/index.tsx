import XLSX from 'xlsx';
import React, {
    Component
} from 'react';
import { IDerivedData, IColumn, IVisibleColumn } from 'dash-table/components/Table/props';
import { createWorkbook, createHeadings, createWorksheet } from './utils';

interface IExportButtonProps {
    export_format: string;
    virtual_data: IDerivedData;
    columns: IColumn[] & IVisibleColumn[];
    merge_duplicate_headers: boolean;
}

export default class ExportButton extends Component<IExportButtonProps, any> {

    handleExport = () => {

        const { columns, export_format, virtual_data, merge_duplicate_headers } = this.props;
        const columnID = columns.map(column => column.id);
        const columnHeaders = columns.map(column => column.name)
        const Heading = createHeadings(columnHeaders);
        const ws = createWorksheet(Heading, export_format, virtual_data.data, columnID);
        const wb = createWorkbook(ws, Heading, merge_duplicate_headers);
        if (export_format === 'xlsx') {
            XLSX.writeFile(wb, 'Data.xlsx', {bookType: 'xlsx', type: 'buffer'});
        } else if (export_format === 'csv') {
            XLSX.writeFile(wb, 'Data.csv', {bookType: 'csv', type: 'buffer'});
        }

    }

    render() {
        const { export_format } = this.props;
        const isFormatSupported = export_format === 'csv' || export_format === 'xlsx';

        return (
            <div>
                { !isFormatSupported ? null : (
                    <button className='export' onClick={this.handleExport}>Export</button>
            )}
            </div>
        );
    }
}