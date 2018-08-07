import React from 'react';
import * as R from 'ramda';
import computedStyles from 'dash-table/components/computedStyles';

const getColLength = c => (Array.isArray(c.name) ? c.name.length : 1);
const getColNameAt = (c, i) => (Array.isArray(c.name) ? c.name[i] : '');

export default class HeaderFactory {
    constructor(props) {
        this.props = props;

        this.sort = this.sort.bind(this);
        this.renderHeaderCells = this.renderHeaderCells.bind(this);
    }

    sort(colId) {
        const {dataframe, setProps, sort} = this.props;

        let newSort = sort;
        const colSort = R.find(R.propEq('column', colId))(sort);

        if (colSort) {
            if (colSort.direction === 'desc') {
                colSort.direction = 'asc';
            } else if (colSort.direction === 'asc') {
                newSort = newSort.filter(
                    R.complement(R.propEq('column', colId))
                );
            }
        } else {
            newSort.push({
                column: colId,
                direction: 'desc',
            });
        }

        newSort = newSort.filter(R.complement(R.isEmpty));

        setProps({
            sort: newSort.filter(R.complement(R.not)),

            dataframe: R.sortWith(
                newSort.map(
                    s =>
                        s.direction === 'desc'
                            ? R.descend(R.prop(s.column))
                            : R.ascend(R.prop(s.column))
                ),
                dataframe
            ),
        });
    }

    renderHeaderCells({labels, rowIsSortable, mergeCells}) {
        const {columns, sort} = this.props;
        let columnIndices;
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
                    R.slice(i, columnIndices[j+1] || Infinity, columns)
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
                computedStyles.scroll.cell(this.props, i, 0)
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
                            className="filter"
                            onClick={() => this.sort(c.id)}
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

    createHeaders() {
        const {
            columns,
            sortable,
            merge_duplicate_headers,
            row_deletable,
            row_selectable
        } = this.props;

        const headerRows = [];

        const selectableCell = !row_selectable ? null : (
            <th className="expanded-row--empty-cell"
                style={{'width': 30}}
             />
        );
        const deletableCell = !row_deletable ? null : (
            <th className="expanded-row--empty-cell"
                style={{'width': 30}}
             />
        )

        // TODO calculate in lifecycle function
        const headerDepth = Math.max.apply(Math, columns.map(getColLength));
        if (headerDepth === 1) {
            headerRows.push((
                <tr key={`header-0`}>
                    {selectableCell}
                    {this.renderHeaderCells({
                        labels: R.pluck('name', columns),
                        rowIsSortable: sortable,
                    })}
                </tr>
            ));
        } else {
            R.range(0, headerDepth).forEach(i => {
                headerRows.push(
                    <tr key={`header-${i}`}>
                        {deletableCell}
                        {selectableCell}
                        {this.renderHeaderCells({
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
                        })}
                    </tr>
                );
            });
        }

        return headerRows;
    }
}