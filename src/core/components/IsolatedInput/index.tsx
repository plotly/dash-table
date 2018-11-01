import React, { PureComponent } from 'react';
import { KEY_CODES } from 'dash-table/utils/unicode';

type Submit = (value: string | undefined) => void;

interface IProps {
    updateOnBlur?: boolean;
    updateOnSubmit?: boolean;
    stopPropagation?: boolean;
    submit: Submit;
    value: string | undefined;
}

interface IDefaultProps {
    stopPropagation: boolean;
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

    handleKeyDown(e: any, stopPropagation: boolean) {
        if(stopPropagation) e.stopPropagation();
        if(e.keyCode === KEY_CODES.ENTER) {
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
            stopPropagation,
            updateOnBlur,
            updateOnSubmit
        } = this.propsWithDefaults;

        let props = {
            onBlur: updateOnBlur ? this.submit : undefined,
            onKeyDown: (e: any) => this.handleKeyDown(e, stopPropagation),
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