import XLSX from 'xlsx';
import React, {
    Component
} from 'react';
import { IDerivedData, IVisibleColumn } from 'dash-table/components/Table/props';
import { createWorkbook, createHeadings, createWorksheet } from './utils';
import getHeaderRows from 'dash-table/derived/header/headerRows';

interface IExportButtonProps {
    export_format: string;
    virtual_data: IDerivedData;
    columns: IVisibleColumn[];
    export_headers: string;
}

export default class ExportButton extends Component<IExportButtonProps, any> {

    handleExport = () => {
        const { columns, export_format, virtual_data, export_headers } = this.props;
        const columnID = columns.map(column => column.id);
        const columnHeaders = columns.map(column => column.name);
        const maxLength = getHeaderRows(columns);
        const heading = (export_headers !== 'none') ? createHeadings(columnHeaders, maxLength) : [];
        const ws = createWorksheet(heading, virtual_data.data, columnID, export_headers);
        const wb = createWorkbook(ws, heading, export_headers);
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