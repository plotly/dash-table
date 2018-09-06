import React, { Component, KeyboardEvent } from 'react';
import { ColumnId } from 'dash-table/components/Table/props';
import { isEqual } from 'core/comparer';
import { KEY_CODES } from 'dash-table/utils/unicode';

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

    private update = () => {
        const { setFilter, value } = this.props;

        if (this.state.value !== value) {
            setFilter({
                target: {
                    value: this.state.value
                }
            } as any);
        }
    }

    private handleBlur = () => {
        this.update();
    }

    private handleChange = (e: any) => {
        this.setState({ value: e.target.value });
    }

    private handleKeyDown = (ev: KeyboardEvent) => {
        ev.stopPropagation();

        if (ev.keyCode !== KEY_CODES.ENTER) {
            return;
        }

        this.update();
    }

    render() {
        const {
            classes
        } = this.props;

        return (<th
            className={classes.join(' ')}
        >
            <input
                type='text'
                value={this.state.value}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
            />
        </th>);
    }
}

export class AdvancedFilter extends Component<IAdvancedFilterProps> {
    constructor(props: IAdvancedFilterProps) {
        super(props);
    }

    private handleChange = (ev: any) => this.props.setFilter(ev);

    render() {
        const {
            colSpan,
            value
        } = this.props;

        return (<th
            colSpan={colSpan}
        >
            <input
                type='text'
                value={value}
                onChange={this.handleChange}
            />
        </th>);
    }
}