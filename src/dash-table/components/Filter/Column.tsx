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
    globalFilterCase?: Case;
    columnFilterCase?: Case;
}

interface IState {
    value?: string;
}

export default class ColumnFilter extends PureComponent<IColumnFilterProps, IState> {
    constructor(props: IColumnFilterProps) {
        super(props);

        this.state = {
            value: props.value
        };
    }

    private submit = (value: string | undefined) => {
        const { columns, column, setFilter } = this.props;

        setFilter(
            columns[R.findIndex(R.propEq('id', column.id))(columns)],
            this.getCase(),
            { target: { value } } as any);
    }

    private setColumnCase = () => {
        const { columns, column, setFilter, columnFilterCase, globalFilterCase, setProps, value } = this.props;

        const cols: IColumn[] = R.clone(columns);
        const inx: number = R.findIndex(R.propEq('id', column.id))(cols);

        const newCase = globalFilterCase === Case.Sensitive
            ? ((columnFilterCase === Case.Sensitive || columnFilterCase === Case.Default || !columnFilterCase) ? Case.Insensitive : Case.Default)
            : (columnFilterCase === Case.Insensitive ? Case.Sensitive : Case.Default);

        cols[inx].filter_case = newCase;

        setFilter(
            cols[inx],
            newCase,
            { target: { value: value || '' } } as any);
        setProps({ columns: cols });
    }

    private getCase = () =>
        this.props.columnFilterCase === Case.Insensitive || this.props.globalFilterCase === Case.Insensitive
            ? Case.Insensitive : Case.Default

    render() {
        const {
            classes,
            column,
            isValid,
            style,
            value,
            globalFilterCase,
            columnFilterCase
        } = this.props;

        const filterCase: Case =
            (globalFilterCase !== Case.Insensitive && columnFilterCase !== Case.Insensitive)
                ? Case.Sensitive : Case.Insensitive;

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
                    filterCase={filterCase}
                    setColumnCase={this.setColumnCase}
                />
            </div>
        </th>);
    }
}