import * as R from 'ramda';
import XLSX from 'xlsx'; 
import React, {
    Component
} from 'react';
import { IDerivedData, IColumn, IVisibleColumn } from 'dash-table/components/Table/props';
import { ifRowIndex } from 'dash-table/conditional';
import keys from 'ramda/es/keys';
import trim from 'ramda/es/trim';
import value from 'core/cache/value';
import { filter } from 'minimatch';

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
            const trimmedValue= cell.trim();
            if (!dict[trimmedValue]) {
                dict[trimmedValue] = {s:{r: rIndex, c: cIndex},e:{r: rIndex, c: cIndex}};
            } else {
                if (dict[trimmedValue] instanceof Array){
                    const valueArray = dict[trimmedValue];
                    let indexValue = -1
                    valueArray.forEach(
                    (mergeValue: { e: { r: number; c: number; }; s: { r: number; c: number; };}, index: number) => {
                        if (mergeValue.e.c + 1 === cIndex){
                            indexValue = index;
                        }});
                    if (indexValue === -1) {
                        valueArray.push({e: { r: rIndex, c: cIndex }, s: { r: rIndex, c: cIndex }});
                    } else if ( indexValue !== -1) {
                        valueArray[indexValue].e = {r: rIndex, c: cIndex};
                    }
                } else if(cIndex === (dict[trimmedValue].e.c + 1)) {
                    dict[trimmedValue].e = {r: rIndex, c: cIndex};
                } else {
                    const valueArray = [dict[trimmedValue]];
                    valueArray.push({e: { r: rIndex, c: cIndex }, s: { r: rIndex, c: cIndex }})
                    dict[trimmedValue] = valueArray;
                }
            }
        }));
        const apiArray : any = Object.values(dict).flat();
        const abc = apiArray.filter((item: { s: { c: number; r: number; }; e: { c: number; r: number; }; }) => item.s.c !== item.e.c || item.s.r !== item.e.r);
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