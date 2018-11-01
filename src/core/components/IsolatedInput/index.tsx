import React, { PureComponent } from 'react';
import { KEY_CODES } from 'dash-table/utils/unicode';

type Submit = (value: string | undefined) => void;

interface IProps {
    updateOnBlur?: boolean;
    updateOnSubmit?: boolean;
    submitOnEnter: boolean;
    stopPropagation?: boolean;
    submit: Submit;
    value: string | undefined;
}

interface IDefaultProps {
    stopPropagation: boolean;
    submitOnEnter: boolean;
    updateOnBlur: boolean;
    updateOnSubmit: boolean;
}

interface IState {
    value: string | undefined;
}

type PropsWithDefaults = IProps & IDefaultProps;

export default class IsolatedInput extends PureComponent<IProps, IState> {
    public static readonly defaultProps = {
        stopPropagation: false,
        submitOnEnter: true,
        updateOnBlur: true,
        updateOnSubmit: true
    };

    private get propsWithDefaults() {
        return this.props as PropsWithDefaults;
    }

    constructor(props: PropsWithDefaults) {
        super(props);

        this.state = {
            value: props.value
        };
    }

    handleKeyDown = (e: React.KeyboardEvent) => {
        const {
            stopPropagation,
            submitOnEnter
        } = this.propsWithDefaults;

        if(stopPropagation) e.stopPropagation();
        if(submitOnEnter && e.keyCode === KEY_CODES.ENTER) {
            this.submit();
        } 
    }

    handleChange = (ev: any) => {
        this.setState({
            value: ev.target.value
        })
    }

    submit = () =>
        this.state.value !== this.props.value &&
        this.props.submit(this.state.value)


    render() {
        const {
            updateOnBlur,
            updateOnSubmit
        } = this.propsWithDefaults;

        let props = {
            onBlur: updateOnBlur ? this.submit : undefined,
            onKeyDown: this.handleKeyDown,
            onSubmit: updateOnSubmit ? this.submit : undefined
        };

        return (<input
            ref='input'
            type='text'
            value={this.state.value || ''}
            onChange={this.handleChange}
            {...props}
        />);
    }
}