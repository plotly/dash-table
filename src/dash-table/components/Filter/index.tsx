import React, { Component } from 'react';

import { isEqual } from 'core/comparer';
import IsolatedInput from 'core/components/IsolatedInput';

import { ColumnId } from 'dash-table/components/Table/props';

type SetFilter = (ev: any) => void;

interface IColumnFilterProps {
    classes: string[];
    setFilter: SetFilter;
    property: ColumnId;
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

export class ColumnFilter extends Component<IColumnFilterProps, IColumnFilterState> {
    constructor(props: IColumnFilterProps) {
        super(props);

        this.state = {
            value: props.value
        };
    }

    shouldComponentUpdate(nextProps: IColumnFilterProps, nextState: IColumnFilterState) {
        const props = this.props;
        const state = this.state;

        return !isEqual(props, nextProps, true) ||
            !isEqual(state, nextState, true);
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
            value
        } = this.props;

        return (<th className={classes.join(' ')}>
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