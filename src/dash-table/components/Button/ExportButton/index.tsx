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
import merge from 'ramda/es/merge';
interface IExportButtonProps {
    export_format: string;
    virtual_data: IDerivedData;
    columns: IColumn[] & IVisibleColumn[];
    merge_duplicate_headers: boolean;
}

interface IMergeObject {
    s: {r: number, c: number};
    e: {r: number, c: number};
}

export default class ExportButton extends Component<IExportButtonProps, any> {

    findMaxLength = (array: any[]) => {
        let maxLength = 0;
        array.forEach(row => { if (row instanceof Array && row.length > maxLength) {
            maxLength = row.length;
        }});
        return maxLength;
    }

    transformMultDimArray = (array: (string | string[])[], maxLength: number) => {
        const newArray = array.map(row=> {
            if (row instanceof Array && row.length < maxLength) {
                return row.concat(Array(maxLength - row.length).fill(""));
            }
            if (maxLength ===0) {
                return [row];
            }
            if (row instanceof String || typeof(row) === 'string') {
                return Array(maxLength).fill(row);
            }
            return row;
        });
        return newArray;
    }

    getHeadings = (array: string[][]) => {
        let apiMergeArray: IMergeObject[] = [];
        array.forEach((row, rIndex) => {
            let dict: any = {};
            row.forEach((cell, cIndex) => {
                const trimmedValue= cell.trim();
                if (!dict[trimmedValue]) {
                    dict[trimmedValue] = {s: {r: rIndex, c: cIndex}, e: {r: rIndex, c: cIndex }};
                } else {
                    if (cIndex === (dict[trimmedValue].e.c + 1)) {
                        dict[trimmedValue].e = {r: rIndex, c: cIndex};
                    } else {
                        apiMergeArray.push(dict[trimmedValue]);
                        dict[trimmedValue] = {s: {r: rIndex, c: cIndex}, e: {r: rIndex, c: cIndex }};
                    }
                }
            });
            const objectsToMerge : IMergeObject[] = Object.values(dict);
            apiMergeArray = R.concat(apiMergeArray, objectsToMerge );
        });

        return R.filter((item: IMergeObject) => item.s.c !== item.e.c || item.s.r !== item.e.r, apiMergeArray);
    }

    handleExport = () => {

        const { columns, export_format, virtual_data, merge_duplicate_headers } = this.props;

        const columnID = columns.map(column => column.id);
        const columnHeaders = columns.map(column => column.name)

        const maxLength = this.findMaxLength(columnHeaders);
        const transformedArray = this.transformMultDimArray(columnHeaders, maxLength);
        const Heading = R.transpose(transformedArray);

        const ws = XLSX.utils.aoa_to_sheet(Heading);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");

        if (export_format === 'xlsx') {

            XLSX.utils.sheet_add_json(ws, virtual_data.data, {
                skipHeader: true,
                origin: Heading.length
            });

            if (merge_duplicate_headers){
                wb.Sheets.SheetJS["!merges"] = this.getHeadings(Heading);;
            };

            XLSX.writeFile(wb, 'Data.xlsx', {bookType: 'xlsx', type: 'buffer'});
        } else if (export_format === 'csv') {
            XLSX.utils.sheet_add_json(ws, virtual_data.data, { header: columnID });
            XLSX.writeFile(wb, 'Data.csv', {bookType: 'csv', type: 'buffer'});
        }
    }

    render() {
        const { export_format } = this.props;
        const isFormatSupported = export_format === 'csv' || export_format === 'xlsx';

        return (
            <div>
                { !isFormatSupported ? null : (
                    <button className='previous-page' onClick={this.handleExport}>Export</button>
            )}
            </div>
        );
    }
}