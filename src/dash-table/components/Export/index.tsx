import React from 'react';
import { IDerivedData, Columns } from 'dash-table/components/Table/props';
import { createWorkbook, createHeadings, exportWorkbook } from './utils';
import getHeaderRows from 'dash-table/derived/header/headerRows';

interface IExportButtonProps {
    columns: Columns;
    export_format: string;
    virtual_data: IDerivedData;
    visibleColumns: Columns;
    export_headers: string;
    merge_duplicate_headers: boolean;
}

export default React.memo((props: IExportButtonProps) => {

    const { columns, export_format, virtual_data, export_headers, visibleColumns, merge_duplicate_headers } = props;
    const isFormatSupported = export_format === 'csv' || export_format === 'xlsx';

    const handleExport = async () => {
        const columnID = visibleColumns.map(column => column.id);
        const columnHeaders = visibleColumns.map(column => column.name);
        const maxLength = getHeaderRows(columns);
        const heading = (export_headers !== 'none') ? createHeadings(columnHeaders, maxLength) : [];

        const wb = await createWorkbook(heading, virtual_data.data, columnID, export_headers, merge_duplicate_headers);

        await exportWorkbook(wb, export_format);
    };

    return (<div>
        {!isFormatSupported ? null : (
            <button className='export' onClick={handleExport}>Export</button>
        )}
    </div>);
});
