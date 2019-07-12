import * as R from 'ramda';

function getGroupedColumnIndices(column, columns, headerRowIndex, mergeDuplicateHeaders) {
    const columnIndex = columns.indexOf(column);

    if (!column.name || (Array.isArray(column.name) && column.name.length < headerRowIndex) || !mergeDuplicateHeaders) {
        return { groupIndexFirst: columnIndex, groupIndexLast: columnIndex };
    }

    let lastColumnIndex = columnIndex;

    for (let i = columnIndex; i < columns.length; ++i) {
        const c = columns[i];

        if (c.name && Array.isArray(c.name) && c.name.length > headerRowIndex && c.name[headerRowIndex] === column.name[headerRowIndex]) {
            lastColumnIndex = i;
        } else {
            break;
        }
    }

    return { groupIndexFirst: columnIndex, groupIndexLast: lastColumnIndex };
}

export function getAffectedColumns(column, columns, headerRowIndex, mergeDuplicateHeaders) {
    const { groupIndexFirst, groupIndexLast } = getGroupedColumnIndices(
        column, columns, headerRowIndex, mergeDuplicateHeaders
    );

    return R.slice(
        groupIndexFirst,
        groupIndexLast + 1,
        R.pluck('id', columns)
    );
}

export function clearColumn(column, columns, headerRowIndex, mergeDuplicateHeaders, data) {
    const rejectedColumnIds = getAffectedColumns(column, columns, headerRowIndex, mergeDuplicateHeaders);

    return {
        data: R.map(R.omit(rejectedColumnIds), data)
    };
}

export function deleteColumn(column, columns, headerRowIndex, mergeDuplicateHeaders, data) {
    const {groupIndexFirst, groupIndexLast} = getGroupedColumnIndices(
        column, columns, headerRowIndex, mergeDuplicateHeaders
    );

    return {
        columns: R.remove(
            groupIndexFirst,
            1 + groupIndexLast - groupIndexFirst,
            columns
        ),
        ...clearColumn(column, columns, headerRowIndex, mergeDuplicateHeaders, data),
        // NOTE - We're just clearing these so that there aren't any
        // inconsistencies. In an ideal world, we would probably only
        // update them if they contained one of the columns that we're
        // trying to delete
        ...clearSelection
    };
}

export const clearSelection = {
    active_cell: undefined,
    start_cell: undefined,
    end_cell: undefined,
    selected_cells: []
};

export function editColumnName(column, columns, headerRowIndex) {
    const { groupIndexFirst, groupIndexLast } = getGroupedColumnIndices(
        column, columns, headerRowIndex
    );
    /* eslint no-alert: 0 */
    const newColumnName = window.prompt('Enter a new column name');
    let newColumns = R.clone(columns);
    R.range(groupIndexFirst, groupIndexLast + 1).map(i => {
        let namePath;
        if (R.type(columns[i].name) === 'Array') {
            namePath = [i, 'name', headerRowIndex];
        } else {
            namePath = [i, 'name'];
        }
        newColumns = R.set(R.lensPath(namePath), newColumnName, newColumns);
    });
    return {
        columns: newColumns
    };
}
