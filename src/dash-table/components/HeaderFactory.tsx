import * as R from 'ramda';
import React from 'react';

import { arrayMap2 } from 'core/math/arrayZipMap';
import { matrixMap, matrixMap3 } from 'core/math/matrixZipMap';

import { ControlledTableProps } from 'dash-table/components/Table/props';
import derivedHeaderContent from 'dash-table/derived/header/content';
import getHeaderRows from 'dash-table/derived/header/headerRows';
import getIndices from 'dash-table/derived/header/indices';
import getLabels from 'dash-table/derived/header/labels';
import derivedHeaderOperations from 'dash-table/derived/header/operations';
import derivedHeaderWrappers from 'dash-table/derived/header/wrappers';
import { derivedRelevantHeaderStyles } from 'dash-table/derived/style';
import derivedHeaderStyles from 'dash-table/derived/header/wrapperStyles';

import derivedHeaderEdges from 'dash-table/derived/edges/header';
import derivedOperationEdges from 'dash-table/derived/edges/operationOfHeaders';

export default class HeaderFactory {
    private readonly headerContent = derivedHeaderContent();
    private readonly headerOperations = derivedHeaderOperations();
    private readonly headerStyles = derivedHeaderStyles();
    private readonly headerWrappers = derivedHeaderWrappers();
    private readonly relevantStyles = derivedRelevantHeaderStyles();

    private readonly headerEdges = derivedHeaderEdges();
    private readonly headerOperationEdges = derivedOperationEdges();

    private get props() {
        return this.propsFn();
    }

    constructor(private readonly propsFn: () => ControlledTableProps) {

    }

    public createHeaders() {
        const props = this.props;

        const {
            columns,
            merge_duplicate_headers,
            pagination_mode,
            row_deletable,
            row_selectable,
            setProps,
            sorting,
            sort_by,
            sorting_type,
            style_cell,
            style_cell_conditional,
            style_header,
            style_header_conditional
        } = props;

        const headerRows = getHeaderRows(columns);

        const labels = getLabels(columns, headerRows);
        const indices = getIndices(columns, labels, merge_duplicate_headers);

        const labelsAndIndices = R.zip(labels, indices);

        const relevantStyles = this.relevantStyles(
            style_cell,
            style_header,
            style_cell_conditional,
            style_header_conditional
        );

        const operationRelevantStyles = this.relevantStyles(
            style_cell,
            style_header,
            R.filter(s => R.isNil(s.if) || (R.isNil(s.if.column_id) && R.isNil(s.if.column_type)), style_cell_conditional),
            R.filter(s => R.isNil(s.if) || (R.isNil(s.if.column_id) && R.isNil(s.if.column_type) && R.isNil(s.if.header_index)), style_header_conditional)
        );

        const operations = this.headerOperations(
            headerRows,
            row_selectable,
            row_deletable
        );

        const headerBorders = this.headerEdges(
            columns,
            headerRows,
            operationRelevantStyles
        );

        const operationBorders = this.headerOperationEdges(
            (row_selectable !== false ? 1 : 0) + (row_deletable ? 1 : 0),
            headerRows,
            relevantStyles
        );

        const wrapperStyles = this.headerStyles(
            columns,
            headerRows,
            relevantStyles
        );

        const wrappers = this.headerWrappers(
            columns,
            labelsAndIndices,
            merge_duplicate_headers
        );

        const content = this.headerContent(
            columns,
            labelsAndIndices,
            sorting,
            sorting_type,
            sort_by,
            pagination_mode,
            setProps,
            props
        );

        const iLastHeaderRow = headerRows - 1;

        const ops = matrixMap(
            operations,
            (o, i, j) => React.cloneElement(o, {
                className: i === iLastHeaderRow ?
                    o.props.className + ` dash-last-header-row` :
                    o.props.className,
                style: operationBorders && operationBorders.getStyle(i, j)
            })
        );

        const headers = matrixMap3(
            wrappers,
            wrapperStyles,
            content,
            (w, s, c, i, j) => React.cloneElement(w, {
                children: [c],
                className: i === iLastHeaderRow ?
                    w.props.className + ` dash-last-header-row` :
                    w.props.className,
                style: R.mergeAll([
                    s,
                    headerBorders && headerBorders.getStyle(i, j)
                ])
            }));

        return arrayMap2(ops, headers, (o, h) => Array.prototype.concat(o, h));
    }
}
