import * as R from 'ramda';

function getGroupedColumnIndices(column, headerRowIndex, props) {
    // Find the set of column indices that share the same name and are adjacent
    // as the given column ("group")
    const {columns} = props;

    // if the columns are merged, then deleting will delete all of the
    // merged columns
    let columnName;
    let names;
    if (R.type(headerRowIndex) !== 'Null') {
        columnName = column.name[headerRowIndex];
        names = R.pluck(
            headerRowIndex,
            R.pluck('name', columns)
        );
    } else {
        columnName = column.name;
        names = R.pluck('name', columns);
    }
    const columnIndex = R.findIndex(R.propEq('id', column.id), columns);
    let groupIndexFirst = columnIndex;
    let groupIndexLast = columnIndex;
    while(names[groupIndexFirst - 1] === columnName) {
        groupIndexFirst--;
    }

    while(names[groupIndexLast + 1] === columnName) {
        groupIndexLast++;
    }

    return {groupIndexFirst, groupIndexLast};
}

export function deleteColumn(column, headerRowIndex, props) {
    const {columns, dataframe} = props;
    const {groupIndexFirst, groupIndexLast} = getGroupedColumnIndices(
        column, headerRowIndex, props
    );
    const rejectedColumnIds = R.slice(
        groupIndexFirst,
        groupIndexLast + 1,
        R.pluck('id', columns)
    );
    return {
        columns: R.remove(
            groupIndexFirst,
            1 + groupIndexLast - groupIndexFirst,
            columns
        ),
        dataframe: R.map(R.omit(rejectedColumnIds), dataframe),
        // NOTE - We're just clearing these so that there aren't any
        // inconsistencies. In an ideal world, we would probably only
        // update them if they contained one of the columns that we're
        // trying to delete
        active_cell: [],
        end_cell: [],
        selected_cell: [],
        start_cell: [0]
    }
}

export function editColumnName(column, headerRowIndex, props) {
    const {columns} = props;
    const {groupIndexFirst, groupIndexLast} = getGroupedColumnIndices(
        column, headerRowIndex, props
    );
    /* eslint no-alert: 0 */
    const newColumnName = window.prompt('Enter a new column name');
    let newColumns = R.clone(columns);
    R.range(groupIndexFirst, groupIndexLast+1).map(i => {
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
    }
}
