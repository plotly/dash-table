import * as R from 'ramda';
import React, { CSSProperties, PureComponent } from 'react';

import IsolatedInput from 'core/components/IsolatedInput';

import { ColumnId, Case, SetProps, IColumn } from 'dash-table/components/Table/props';
import TableClipboardHelper from 'dash-table/utils/TableClipboardHelper';

type SetFilter = (ev: any) => void;

interface IColumnFilterProps {
    classes: string;
    columnId: ColumnId;
    columns: IColumn[];
    isValid: boolean;
    setFilter: SetFilter;
    setProps: SetProps;
    style?: CSSProperties;
    value?: string;
    globalFilterCase?: Case;
    columnFilterCaseSensitive?: boolean;
    columnFilterCaseInsensitive?: boolean;
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
        const { setFilter } = this.props;

        setFilter({
            target: { value }
        } as any);
    }

    render() {
        const {
            classes,
            columnId,
            columns,
            isValid,
            style,
            value,
            globalFilterCase,
            columnFilterCaseSensitive,
            columnFilterCaseInsensitive,
            setProps
        } = this.props;

        const filterCaseClass: string =
            (globalFilterCase !== Case.Insensitive && !columnFilterCaseInsensitive) ?
                'dash-filter--case--sensitive' : 'dash-filter--case--insensitive';

        function setColumnCase() {
            const cols: IColumn[] = R.clone(columns);
            const inx: number = R.findIndex(R.propEq('id', columnId))(cols);

            cols[inx].filter_case_sensitive = !columnFilterCaseSensitive &&
                globalFilterCase === Case.Insensitive;
            cols[inx].filter_case_insensitive = !columnFilterCaseInsensitive &&
                (globalFilterCase === Case.Sensitive || globalFilterCase === Case.Default);

            setProps({ columns: cols });
        }

        return (<th
            className={classes + (isValid ? '' : ' invalid')}
            data-dash-column={columnId}
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
                <input
                    type='button'
                    className={'dash-filter--case ' + filterCaseClass}
                    onClick={setColumnCase}
                    value='Aa'
                />
            </div>
        </th>);
    }
}