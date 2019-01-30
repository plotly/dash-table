import React, { PureComponent } from 'react';
import Remarkable from 'remarkable';

import { TooltipSyntax } from 'dash-table/tooltips/props';

interface ITooltipProps {
    arrow?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
    delay: number;
    duration: number;
    type?: TooltipSyntax;
    value?: string;
}

interface ITooltipState {
    display?: boolean;
    displayTooltipId?: any;
    hideTooltipId?: any;
    md: Remarkable;
}

export default class Tooltip extends PureComponent<ITooltipProps, ITooltipState> {
    constructor(props: ITooltipProps) {
        super(props);

        this.state = {
            md: new Remarkable()
        };
    }

    componentWillReceiveProps(nextProps: ITooltipProps) {
        const { delay, duration } = nextProps;

        this.setState({
            display: false,
            displayTooltipId: Boolean(clearTimeout(this.state.displayTooltipId)) ||
                setTimeout(() => this.setState({ display: true }), delay),
            hideTooltipId: Boolean(clearTimeout(this.state.hideTooltipId)) ||
                setTimeout(() => this.setState({ display: false }), delay + duration)
        });
    }

    render() {
        const { className, type, value } = this.props;
        const { md } = this.state;

        if (!type || !value) {
            return null;
        }

        const props = type === TooltipSyntax.Text ?
            { children: value } :
            { dangerouslySetInnerHTML: { __html: md.render(value) } };

        const { display } = this.state;

        return (<div
            style={{ visibility: (display ? 'visible' : 'hidden') }}
            className={className}
            {...props}
        />);
    }
}