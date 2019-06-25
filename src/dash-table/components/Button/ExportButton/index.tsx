import * as R from 'ramda';
import XLSX from 'xlsx'; 
import React, {
    Component
} from 'react';
import { IDerivedData, IColumn, IVisibleColumn } from 'dash-table/components/Table/props';
import { ifRowIndex } from 'dash-table/conditional';
import keys from 'ramda/es/keys';

interface IExportButtonProps {
    export_format: string;
    virtual_data: IDerivedData;
    columns: IColumn[] & IVisibleColumn[]
}
export default class ExportButton extends Component<IExportButtonProps, any> {
    handleExport = () => {
        const columnID = this.props.columns.map(column=> column.id);
        const columnHeaders = this.props.columns.map(column => column.name)
        let maxLength = 0;
        columnHeaders.forEach(row => { if (row instanceof Array && row.length > maxLength) {
            maxLength = row.length;
        }});
        const newArray = columnHeaders.map(row=> {
            if (row instanceof Array && row.length < maxLength) {
                return row.concat(Array(maxLength -row.length).fill(""));
            }
            if (row instanceof String || typeof(row) === 'string' ){
                let returnArray = Array(maxLength).fill(row);
                returnArray[0] = row;
                return returnArray;
            }
            return row;
        });
        const Heading = R.transpose(newArray);
        const dict: any = {};
        Heading.forEach((row, rIndex)=> row.forEach((cell, cIndex) => {
            if(cell === ""){
                return;
            }
            if (!dict[cell]) {
                dict[cell] = {s:{r:rIndex,c:cIndex},e:{r:rIndex,c:cIndex}};
            } else if (rIndex === (dict[cell].e.r +1) || cIndex === (dict[cell].e.c + 1)){
                dict[cell].e = {r:rIndex,c:cIndex};
            }
        }));
        const abc : any = Object.values(dict);
        const ws = XLSX.utils.aoa_to_sheet(Heading);
        XLSX.utils.sheet_add_json(ws, this.props.virtual_data.data, {
            header: columnID,
            skipHeader: true,
            origin: Heading.length
           });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        if (this.props.export_format === 'xlsx') {
            wb.Sheets.SheetJS["!merges"] = abc;
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