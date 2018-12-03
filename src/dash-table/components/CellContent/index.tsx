import React, {
    PureComponent,
    KeyboardEvent
} from 'react';

import {
    ICellDefaultProps,
    ICellProps,
    ICellPropsWithDefaults,
    ICellState
} from 'dash-table/components/CellContent/props';

import {
    KEY_CODES, isNavKey
} from 'dash-table/utils/unicode';
import { ColumnType } from 'dash-table/components/Table/props';

export default class CellContent extends PureComponent<ICellProps, ICellState> {

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

    private renderInput() {
        const {
            active,
            focused,
            onClick,
            onDoubleClick,
            onMouseUp,
            onPaste,
            value
        } = this.propsWithDefaults;

        const classes = [
            ...(active ? ['input-active'] : []),
            ...(focused ? ['focused'] : ['unfocused']),
            ...['dash-cell-value']
        ];

        const attributes = {
            className: classes.join(' '),
            onClick: onClick,
            onDoubleClick: onDoubleClick,
            onMouseUp: onMouseUp
        };

        return (<div className='dash-input-cell-value-container dash-cell-value-container'>
            <div className='input-cell-value-shadow cell-value-shadow'>
                {value}
            </div>
            <input
                ref='textInput'
                type='text'
                value={this.state.value}
                onBlur={this.propagateChange}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                onPaste={onPaste}
                {...attributes}
            />
        </div>);
    }

    render() {
        const { type } = this.props;

        switch (type) {
            case ColumnType.Text:
            case ColumnType.Numeric:
                return this.renderInput();
            default:
                throw new Error(`unknown type ${type}`);
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
        const is_focused = this.props.focused;

        if (is_focused &&
            (e.keyCode !== KEY_CODES.TAB && e.keyCode !== KEY_CODES.ENTER)
        ) {
            return;
        }

        if (!is_focused && !isNavKey(e.keyCode)) {
            return;
        }

        this.propagateChange();
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
        this.setFocus();
    }

    componentDidMount() {
        this.setFocus();
    }

    private setFocus() {
        const { active } = this.propsWithDefaults;
        if (!active) {
            return;
        }

        const input = this.refs.textInput as HTMLInputElement;

        if (input && document.activeElement !== input) {
            input.focus();
            input.setSelectionRange(0, input.value ? input.value.length : 0);
        }
    }
}