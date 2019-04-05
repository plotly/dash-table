import * as R from 'ramda';
import React from 'react';

import {memoizeOneFactory} from 'core/memoizer';
import {IEdge} from 'dash-table/type/edge';

import {Datum, RowSelection} from 'dash-table/components/Table/props';

function rowSelectCell(vertical_edge: IEdge, horizontal_edge: IEdge) {
    const borderStyles = {
        borderRight: vertical_edge.borders[0],
        borderTop: horizontal_edge.borders[0],
        borderLeft: vertical_edge.borders[0],
    };
    return (
        <th
            key="select"
            className="expanded-row--empty-cell dash-select-header"
            style={{
                width: `30px`,
                maxWidth: `30px`,
                minWidth: `30px`,
                ...borderStyles,
            }}
        />
    );
}

function rowDeleteHeader(vertical_edge: IEdge, horizontal_edge: IEdge) {
    const borderStyles = {
        borderRight: vertical_edge.borders[0],
        borderTop: horizontal_edge.borders[0],
        borderLeft: vertical_edge.borders[0],
    };
    return (
        <th
            key="delete"
            className="expanded-row--empty-cell dash-delete-header"
            style={{
                width: `30px`,
                maxWidth: `30px`,
                minWidth: `30px`,
                ...borderStyles,
            }}
        />
    );
}

const getter = (
    headerRows: number,
    rowSelectable: RowSelection,
    rowDeletable: boolean,
    vertical_edges: IEdge[][],
    horizontal_edges: IEdge[][]
): JSX.Element[][] =>
    R.addIndex<Datum, JSX.Element[]>(R.map)(
        index => [
            ...(rowDeletable
                ? [
                      rowDeleteHeader(
                          vertical_edges[index][0],
                          horizontal_edges[index][0]
                      ),
                  ]
                : []),
            ...(rowSelectable
                ? [
                      rowSelectCell(
                          vertical_edges[index][0],
                          horizontal_edges[index][0]
                      ),
                  ]
                : []),
        ],
        R.range(0, headerRows)
    );

export default memoizeOneFactory(getter);
