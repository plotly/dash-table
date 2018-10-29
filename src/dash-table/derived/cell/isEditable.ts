export default (
    editable: boolean,
    editableColumn: boolean | undefined
): boolean => editableColumn === undefined ?
        editable :
        editableColumn;