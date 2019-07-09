import * as R from 'ramda';
import XLSX from 'xlsx';

interface IMergeObject {
    s: {r: number, c: number};
    e: {r: number, c: number};
}

export function findMaxLength(array: (string | string[])[]): number {
    let maxLength = 0;
    R.forEach(row => { if (row instanceof Array && row.length > maxLength) {
        maxLength = row.length;
    }}, array);
    return maxLength;
};

export function transformMultDimArray(array: (string | string[])[], maxLength: number): string[][] {
    const newArray: string[][] = array.map(row => {
        if (row instanceof Array && row.length < maxLength) {
            return row.concat(Array(maxLength - row.length).fill(""));
        }
        if (maxLength === 0) {
            return [row];
        }
        if (row instanceof String || typeof(row) === 'string') {
            return Array(maxLength).fill(row);
        }
        return row;
    });
    return newArray;
}

export function getMergeRanges(array: string[][]) {
    let apiMergeArray: IMergeObject[] = [];
    const iForEachOuter = R.addIndex<(string[]), void>(R.forEach);
    const iForEachInner = R.addIndex<(string), void>(R.forEach);
    iForEachOuter((row: string[], rIndex: number) => {
        let dict: any = {};
        iForEachInner((cell: string, cIndex: number) => {
            if (!dict[cell]) {
                dict[cell] = {s: {r: rIndex, c: cIndex}, e: {r: rIndex, c: cIndex }};
            } else {
                if (cIndex === (dict[cell].e.c + 1)) {
                    dict[cell].e = {r: rIndex, c: cIndex};
                } else {
                    apiMergeArray.push(dict[cell]);
                    dict[cell] = {s: {r: rIndex, c: cIndex}, e: {r: rIndex, c: cIndex }};
                }
            }
        }, row);
        const objectsToMerge: IMergeObject[] = Object.values(dict);
        apiMergeArray = R.concat(apiMergeArray, objectsToMerge );
    }, array);
    return R.filter((item: IMergeObject) => item.s.c !== item.e.c || item.s.r !== item.e.r, apiMergeArray);
}

export function createWorkbook(ws: XLSX.WorkSheet, Heading: string[][], merge_duplicate_headers: boolean) {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');

    if (merge_duplicate_headers){
        wb.Sheets.SheetJS['!merges'] = getMergeRanges(Heading);
    }
    return wb;
}

export function createWorksheet(Heading: string[][], export_format: string, data: any[], columnID: string[] ) {
    const ws = XLSX.utils.aoa_to_sheet(Heading);
    if (export_format === 'xlsx') {
        XLSX.utils.sheet_add_json(ws, data, {
            skipHeader: true,
            origin: Heading.length
        });
    } else if (export_format === 'csv') {
        XLSX.utils.sheet_add_json(ws, data, { header: columnID });
    }
    return ws;
}

export function createHeadings(columnHeaders: (string | string[])[]) {
    const maxLength = findMaxLength(columnHeaders);
    const transformedArray = transformMultDimArray(columnHeaders, maxLength);
    return R.transpose(transformedArray);
}


