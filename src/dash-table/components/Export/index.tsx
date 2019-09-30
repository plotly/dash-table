import XLSX from 'xlsx';
import React from 'react';
import { IDerivedData, Columns, ExportHeaders, ExportFormat, ExportColumns } from 'dash-table/components/Table/props';
import { createWorkbook, createHeadings, createWorksheet } from './utils';
import getHeaderRows from 'dash-table/derived/header/headerRows';

interface IExportButtonProps {
    columns: Columns;
    export_columns: ExportColumns;
    export_format: ExportFormat;
    virtual_data: IDerivedData;
    visibleColumns: Columns;
    export_headers: ExportHeaders;
    merge_duplicate_headers: boolean;
}

export function filterData(data: Data, columnID: string[]) {

    var filteredData: Datum[] = [];

    data.forEach(data_row => {
        var filtered_row: Datum = {};
        columnID.forEach(column => {
            filtered_row[column] = data_row[column];
        });
        filteredData.push(filtered_row);
    });

    return filteredData;
}

export default React.memo((props: IExportButtonProps) => {

    const { columns, export_columns, export_format, virtual_data, export_headers, visibleColumns, merge_duplicate_headers } = props;
    const isFormatSupported = export_format === ExportFormat.Csv || export_format === ExportFormat.Xlsx;

    const exportedColumns = export_columns === ExportColumns.Visible ? visibleColumns : columns;

    const handleExport = () => {
        const columnID = exportedColumns.map(column => column.id);
        const columnHeaders = exportedColumns.map(column => column.name);

        const maxLength = getHeaderRows(columns);
        const heading = (export_headers !== ExportHeaders.None) ? createHeadings(columnHeaders, maxLength) : [];
        const ws = createWorksheet(heading, virtual_data.data, columnID, export_headers, merge_duplicate_headers);
        const wb = createWorkbook(ws);
        if (export_format === ExportFormat.Xlsx) {
            XLSX.writeFile(wb, 'Data.xlsx', { bookType: 'xlsx', type: 'buffer' });
        } else if (export_format === ExportFormat.Csv) {
            XLSX.writeFile(wb, 'Data.csv', { bookType: 'csv', type: 'buffer' });
        }
    };

    return (<div>
        {!isFormatSupported ? null : (
            <button className='export' onClick={handleExport}>Export</button>
        )}
    </div>);
});
