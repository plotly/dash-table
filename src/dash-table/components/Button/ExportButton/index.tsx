import * as R from 'ramda';
import XLSX from 'xlsx'; 
import React, {
    Component
} from 'react';
import { IDerivedData, IColumn, IVisibleColumn } from 'dash-table/components/Table/props';

interface IExportButtonProps {
    export_format: string;
    virtual_data: IDerivedData;
    columns: IColumn[] & IVisibleColumn[]
}
export default class ExportButton extends Component<IExportButtonProps, any> {
    handleExport = () => {
        const columnID = this.props.columns.map(column=> column.id);
        const columnHeaders = this.props.columns.map(column => column.name).map(header => { if ((header instanceof Array)){
            return header;
        } else {
            return [header, header, header];
        }});
        const Heading = R.transpose(columnHeaders);
        const ws = XLSX.utils.aoa_to_sheet(Heading);
        XLSX.utils.sheet_add_json(ws, this.props.virtual_data.data, {
            header: columnID,
            skipHeader: true,
            origin: Heading.length
           });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        if (this.props.export_format === 'xlsx') {
            XLSX.writeFile(wb, 'Data.xlsx', {bookType: 'xlsx', type: 'buffer'});
        } else if (this.props.export_format === 'csv') {
            XLSX.writeFile(wb, 'Data.csv', {bookType: 'csv', type: 'buffer'});
        }

    }

    render() {
        const isFormatSupported = this.props.export_format === 'csv' || this.props.export_format === 'xlsx';
        return (
            <div>
                { !isFormatSupported ? null : (
                    <button className='previous-page' onClick={this.handleExport}>Export</button>
            )}
            </div>
        );
    }
}