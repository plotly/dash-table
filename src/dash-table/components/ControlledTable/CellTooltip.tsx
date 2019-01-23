import React, { PureComponent } from 'react';

import { Tooltip, TooltipSyntax } from 'dash-table/tooltips/props';
import { ColumnId } from '../Table/props';

interface IProps {
    column?: ColumnId;
    delay: number;
    row?: number;
    tooltip?: Tooltip;
}

interface IState {
    md?: Remarkable;
    display: boolean;
    tooltipTimeoutId?: any;
}

export default class CellTooltip extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            display: false
        };
    }

    componentWillReceiveProps() {
        const { state } = this;

        this.setState({
            display: false,
            tooltipTimeoutId: Boolean(clearTimeout(state.tooltipTimeoutId)) ||
                setTimeout(() => this.setState({ display: true }), this.props.delay)
        });
    }

    private renderTooltip(tooltip: Tooltip, md: Remarkable) {
        const isText = typeof tooltip === 'string' || tooltip.type === TooltipSyntax.Text;
        const tooltipValue = typeof tooltip === 'string' ? tooltip : tooltip.value;

        const props = {
            className: 'dash-table-tooltip'
        };

        const extraProps = isText ?
            { children: tooltipValue } :
            { dangerouslySetInnerHTML: { __html: md.render(tooltipValue) } };

        const { display } = this.state;

        return (<div
            ref='innerTooltip'
            style={{ visibility: (display ? 'visible' : 'hidden') }}
            {...props}
            {...extraProps}
        />);
    }

    render() {
        const { tooltip } = this.props;
        const { md } = this.state;

        if (tooltip && !md) {
            import(/* webpackChunkName: "markdown" */ 'remarkable')
                .then(lib => lib.default)
                .then(Remarkable => {
                    this.setState({ md: new Remarkable() });
                });
            return null;
        }

        return (!tooltip || !md) ?
            null :
            this.renderTooltip(tooltip, md);
    }
}