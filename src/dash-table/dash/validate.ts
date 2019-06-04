import * as R from 'ramda';

import Logger from 'core/Logger';
import { TableAction } from 'dash-table/components/Table/props';

function isFrontEnd(value: TableAction) {
    return value !== TableAction.Custom;
}

function isBackEnd(value: TableAction) {
    return value !== TableAction.Native;
}

function validColumns(props: any) {
    const {
        columns
    } = props;

    return !R.any((column: any) =>
        column.format && (
            (
                column.format.symbol &&
                column.format.symbol.length !== 2
            ) || (
                column.format.grouping &&
                column.format.grouping.length === 0
            ) || (
                column.format.numerals &&
                column.format.numerals.length !== 10
            )
        ))(columns);
}

function validFSP(props: any) {
    const {
        filtering,
        sorting,
        pagination_mode
    } = props;

    return isFrontEnd(pagination_mode) ||
        (isBackEnd(filtering) && isBackEnd(sorting));
}

export default (props: any): boolean => {
    if (!validFSP(props)) {
        Logger.error(`Invalid combination of filtering / sorting / pagination`);
        return false;
    }

    if (!validColumns(props)) {
        Logger.error(`Invalid column format`);
        return false;
    }

    return true;
};