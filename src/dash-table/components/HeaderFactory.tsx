import React from 'react';
import * as R from 'ramda';
import computedStyles from 'dash-table/components/computedStyles';

interface ICellOptions {
    columns: any[];
    labels: any[];
    mergeCells?: boolean;
    rowIsSortable: boolean;
    sort: any;
}

interface IOptions extends ICellOptions {
    merge_duplicate_headers: boolean;
    n_fixed_columns: number;
    n_fixed_rows: number;
    row_deletable: boolean;
    row_selectable: boolean;
    sortable: boolean;
}

const getColLength = (c: any) => (Array.isArray(c.name) ? c.name.length : 1);
const getColNameAt = (c: any, i: number) => (Array.isArray(c.name) ? c.name[i] : '');

export default class HeaderFactory {
    private static createHeaderCells(options: ICellOptions) {
        const { columns, labels, mergeCells, rowIsSortable, sort } = options;

        let columnIndices: any[] = [];

        if (!mergeCells) {
            columnIndices = R.range(0, columns.length);
        } else {
            columnIndices = [0];
            let compareIndex = 0;
            labels.forEach((label, i) => {
                if (label === labels[compareIndex]) {
                    return;
                }
                columnIndices.push(i);
                compareIndex = i;
            });
        }

        return columnIndices.map((i, j) => {
            const c = columns[i];
            if (c.hidden) {
                return null;
            }
            let style = R.merge({}, c.style) || {};

            let colSpan;
            if (!mergeCells) {
                colSpan = 1;
            } else {
                const nHiddenColumns = (
                    R.slice(i, columnIndices[j + 1] || Infinity, columns)
                     .filter(R.propEq('hidden', true))
                     .length);
                if (i === R.last(columnIndices)) {
                    colSpan = labels.length - i - nHiddenColumns;
                } else {
                    colSpan = columnIndices[j + 1] - i - nHiddenColumns;
                }
            }

            if (c.width && colSpan === 1) {
                style.width = c.width;
                style.maxWidth = c.width;
                style.minWidth = c.width;
            }

            style = R.merge(
                style,
                computedStyles.scroll.cell(options, i)
            );

            if (colSpan !== 1) {
                const widths = R.range(
                    i,
                    R.min(i + colSpan, labels.length)
                ).map(
                    k =>
                        R.type(columns[k].width) === 'Number'
                            ? `${columns[k].width}px`
                            : columns[k].width
                );
                style.width = `calc(${widths.join(' + ')})`;
                style.maxWidth = style.width;
                style.minWidth = style.width;
            }

            return (
                <th
                    key={`header-cell-${i}`}
                    colSpan={colSpan}
                    style={style}
                    className={`${
                        i === columns.length - 1 || i === R.last(columnIndices)
                            ? 'cell--right-last'
                            : ''
                    }`}
                >
                    {rowIsSortable ? (
                        <span
                            className='filter'
                            onClick={() => sort(c.id)}
                        >
                            {R.find(R.propEq('column', c.id), sort)
                                ? R.find(R.propEq('column', c.id), sort)
                                      .direction === 'desc'
                                    ? '↑'
                                    : '↓'
                                : '↕'}
                        </span>
                    ) : (
                        ''
                    )}

                    <span>{labels[i]}</span>
                </th>
            );
        });
    }

    static createHeaders(options: IOptions) {
        let {
            columns,
            sortable,
            merge_duplicate_headers,
            row_deletable,
            row_selectable,
            sort
        } = options;

        const deletableCell = !row_deletable ? null : (
            <th className='expanded-row--empty-cell'
                style={{ width: 30 }}
            />
        );

        const selectableCell = !row_selectable ? null : (
            <th className='expanded-row--empty-cell'
                style={{ width: 30 }}
            />
        );

        const headerDepth = Math.max.apply(Math, columns.map(getColLength));
        if (headerDepth === 1) {
            return [(
                <tr key={`header-0`}>
                    {selectableCell}
                    {HeaderFactory.createHeaderCells({
                        columns,
                        labels: R.pluck('name', columns),
                        rowIsSortable: sortable,
                        sort
                    })}
                </tr>
            )];
        } else {
            return R.range(0, headerDepth).map(i => (
                <tr key={`header-${i}`}>
                    {deletableCell}
                    {selectableCell}
                    {HeaderFactory.createHeaderCells({
                        columns,
                        labels: columns.map(
                            c =>
                                R.isNil(c.name) && i === headerDepth - 1
                                    ? c.id
                                    : getColNameAt(c, i)
                        ),
                        rowIsSortable: sortable && i + 1 === headerDepth,
                        mergeCells:
                            merge_duplicate_headers &&
                            i + 1 !== headerDepth,
                        sort
                    })}
                </tr>
            ));
        }
//         const selectableCell = !row_selectable ? null : (
//             <th className= "expanded-row--empty-cell"
//         style = {{ 'width': 30 }
//     }
//              />
//         );
// const deletableCell = !row_deletable ? null : (
//     <th className= "expanded-row--empty-cell"
// style = {{ 'width': 30 }}
// />
//         )

// // TODO calculate in lifecycle function
// const headerDepth = Math.max.apply(Math, columns.map(getColLength));
// if (headerDepth === 1) {
//     h
//         } else {
//
// });
//         }

// return headerRows;
    }

    // sort(colId) {
    //     const {dataframe, setProps, sort} = this.props;

    //     let newSort = sort;
    //     const colSort = R.find(R.propEq('column', colId))(sort);

    //     if (colSort) {
    //         if (colSort.direction === 'desc') {
    //             colSort.direction = 'asc';
    //         } else if (colSort.direction === 'asc') {
    //             newSort = newSort.filter(
    //                 R.complement(R.propEq('column', colId))
    //             );
    //         }
    //     } else {
    //         newSort.push({
    //             column: colId,
    //             direction: 'desc',
    //         });
    //     }

    //     newSort = newSort.filter(R.complement(R.isEmpty));

    //     setProps({
    //         sort: newSort.filter(R.complement(R.not)),

    //         dataframe: R.sortWith(
    //             newSort.map(
    //                 s =>
    //                     s.direction === 'desc'
    //                         ? R.descend(R.prop(s.column))
    //                         : R.ascend(R.prop(s.column))
    //             ),
    //             dataframe
    //         ),
    //     });
    // }

    // renderHeaderCells({labels, rowIsSortable, mergeCells}) {

    // }

}