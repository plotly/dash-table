import React, {
    Component,
    KeyboardEvent
} from 'react';
import Dropdown from 'react-select';

import { isEqual } from 'core/comparer';

import {
    ICellDefaultProps,
    ICellProps,
    ICellPropsWithDefaults,
    ICellState
} from 'dash-table/components/CellInput/props';

import {
    KEY_CODES
} from 'dash-table/utils/unicode';
import { ColumnType } from 'dash-table/components/Table/props';
import dropdownHelper from 'dash-table/components/dropdownHelper';

export default class CellInput extends Component<ICellProps, ICellState> {

    public static defaultProps: ICellDefaultProps = {
        conditionalDropdowns: [],
        type: ColumnType.Text
    };

    constructor(props: ICellProps) {
        super(props);

        this.state = {
            value: props.value
        };
    }

    private get propsWithDefaults(): ICellPropsWithDefaults {
        return this.props as ICellPropsWithDefaults;
    }

    private renderDropdown() {
        const {
            clearable,
            dropdown,
            onChange,
            value
        } = this.propsWithDefaults;

        return !dropdown ?
            this.renderValue() :
            (<Dropdown
                ref='dropdown'
                clearable={clearable}
                onChange={(newValue: any) => {
                    onChange(newValue ? newValue.value : newValue);
                }}
                onOpen={this.handleOpenDropdown}
                options={dropdown}
                placeholder={''}
                value={value}
            />);
    }

    private renderInput() {
        const {
            active,
            focused,
            onClick,
            onDoubleClick,
            onPaste
        } = this.propsWithDefaults;

        const classes = [
            ...(active ? ['input-active'] : []),
            ...(focused ? ['focused'] : ['unfocused']),
            ...['dash-cell-value']
        ];

        const attributes = {
            className: classes.join(' '),
            onClick: onClick,
            onDoubleClick: onDoubleClick
        };

        return (!active && this.state.value === this.props.value) ?
            this.renderValue(attributes) :
            (<input
                ref='textInput'
                type='text'
                value={this.state.value}
                onBlur={this.propagateChange}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                onPaste={onPaste}
                {...attributes}
            />);
    }

    private renderValue(attributes = {}) {
        const { value } = this.propsWithDefaults;

        return (<div
            {...attributes}
        >
            {value}
        </div>);
    }

    render() {
        const { type } = this.props;

        switch (type) {
            case ColumnType.Text:
            case ColumnType.Numeric:
                return this.renderInput();
            case ColumnType.Dropdown:
                return this.renderDropdown();
            default:
                return this.renderValue();
        }
    }

    propagateChange = () => {
        if (this.state.value === this.props.value) {
            return;
        }

        const { onChange } = this.props;

        onChange(this.state.value);
    }

    handleChange = (e: any) => {
        this.setState({ value: e.target.value });
    }

    handleKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode !== KEY_CODES.ENTER) {
            return;
        }

        this.propagateChange();
    }

    handleOpenDropdown = () => {
        const { dropdown, td }: { [key: string]: any } = this.refs;

        dropdownHelper(
            dropdown.wrapper.querySelector('.Select-menu-outer'),
            td
        );
    }

    componentWillReceiveProps(nextProps: ICellPropsWithDefaults) {
        const { value: nextValue } = nextProps;

        if (this.state.value !== nextValue) {
            this.setState({
                value: nextValue
            });
        }
    }

    componentDidUpdate() {
        const { active } = this.propsWithDefaults;
        const input = this.refs.textInput as HTMLInputElement;

        if (active && input && document.activeElement !== input) {
            input.focus();
            input.setSelectionRange(0, input.value ? input.value.length : 0);
        }

        if (active && this.refs.dropdown) {
            // Limitation due to React < 16 --> Use React.createRef instead to pass parent ref to child
            ((this.refs.dropdown as any).wrapper.parentElement as HTMLElement).focus();
        }
    }

    shouldComponentUpdate(nextProps: ICellPropsWithDefaults, nextState: ICellState) {
        const props = this.props;
        const state = this.state;

        return !isEqual(props, nextProps, true) ||
            !isEqual(state, nextState, true);
    }
}