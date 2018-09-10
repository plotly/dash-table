import React, { Component, PureComponent } from 'react';

import IsolatedInput from 'core/components/IsolatedInput';

import { ColumnId } from 'dash-table/components/Table/props';

type SetFilter = (ev: any) => void;

interface IColumnFilterProps {
    classes: string;
    isValid: boolean;
    property: ColumnId;
    setFilter: SetFilter;
    value?: string;
}

interface IColumnFilterState {
    value?: string;
}

interface IAdvancedFilterProps {
    classes: string[];
    colSpan: number;
    setFilter: SetFilter;
    value?: string;
}

export class ColumnFilter extends PureComponent<IColumnFilterProps, IColumnFilterState> {
    constructor(props: IColumnFilterProps) {
        super(props);

        this.state = {
            value: props.value
        };
    }

    componentWillReceiveProps(nextProps: IColumnFilterProps) {
        const { value: nextValue } = nextProps;

        if (this.state.value !== nextValue) {
            this.setState({
                value: nextValue
            });
        }
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
            isValid,
            value
        } = this.props;

        return (<th className={classes + (isValid ? '' : ' invalid')}>
            <IsolatedInput
                value={value}
                stopPropagation={true}
                submit={this.submit}
            />
        </th>);
    }
}

export class AdvancedFilter extends Component<IAdvancedFilterProps> {
    constructor(props: IAdvancedFilterProps) {
        super(props);
    }

    private submit = (ev: any) => this.props.setFilter(ev);

    render() {
        const {
            colSpan,
            value
        } = this.props;

        return (<th
            colSpan={colSpan}
        >
            <IsolatedInput
                stopPropagation={true}
                value={value}
                submit={this.submit}
            />
        </th>);
    }
}