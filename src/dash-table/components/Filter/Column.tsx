import * as R from 'ramda';
import React, { CSSProperties, PureComponent } from 'react';

import IsolatedInput from 'core/components/IsolatedInput';
import FilterCaseButton from './FilterCaseButton';

import { Case, SetProps, IColumn } from 'dash-table/components/Table/props';
import TableClipboardHelper from 'dash-table/utils/TableClipboardHelper';

type SetFilter = (ev: any, c: Case, column: IColumn) => void;

interface IColumnFilterProps {
    classes: string;
    column: IColumn;
    columns: IColumn[];
    isValid: boolean;
    setFilter: SetFilter;
    setProps: SetProps;
    style?: CSSProperties;
    value?: string;
    globalFilterCase: Case;
    columnFilterCase: Case;
}

export default class ColumnFilter extends PureComponent<IColumnFilterProps> {
    private submit = (value: string | undefined) => {
        const { column, setFilter, columnFilterCase } = this.props;

        setFilter(
            column,
            this.getComputedCase(columnFilterCase),
            value as any);
    }

    private setColumnCase = () => {
        const { columns, column, setFilter, columnFilterCase, globalFilterCase, setProps, value } = this.props;

        const cols: IColumn[] = R.clone(columns);
        const inx: number = R.findIndex(R.propEq('id', column.id))(cols);

        const newColumnFilterCase = globalFilterCase === Case.Sensitive
            ? ((columnFilterCase === Case.Sensitive || columnFilterCase === Case.Default)
            ? Case.Insensitive : Case.Default)
            : ((columnFilterCase === Case.Insensitive || columnFilterCase === Case.Default)
            ? Case.Sensitive : Case.Default);

        const newComputedCase = this.getComputedCase(newColumnFilterCase);

        cols[inx].filter_case = newColumnFilterCase;

        setFilter(
            cols[inx],
            newComputedCase,
            value || '' as any);
        setProps({ columns: cols });
    }

    private getComputedCase = (columnFilterCase: Case) =>
        (columnFilterCase === Case.Insensitive ||
            (this.props.globalFilterCase === Case.Insensitive && columnFilterCase !== Case.Sensitive))
            ? Case.Insensitive : Case.Sensitive

    render() {
        const {
            classes,
            column,
            isValid,
            style,
            value,
            columnFilterCase
        } = this.props;

        return (<th
            className={classes + (isValid ? '' : ' invalid')}
            data-dash-column={column.id}
            style={style}
        >
            <IsolatedInput
                onCopy={(e: any) => {
                    e.stopPropagation();
                    TableClipboardHelper.clearClipboard();
                }}
                onPaste={(e: any) => {
                    e.stopPropagation();
                }}
                value={value}
                placeholder='filter data...'
                stopPropagation={true}
                submit={this.submit}
            />
            <div>
                <FilterCaseButton
                    filterCase={this.getComputedCase(columnFilterCase)}
                    setColumnCase={this.setColumnCase}
                />
            </div>
        </th>);
    }
}