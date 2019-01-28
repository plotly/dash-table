import React, { PureComponent } from 'react';

import { Tooltip, TooltipSyntax } from 'dash-table/tooltips/props';
import { ColumnId } from '../Table/props';

interface IProps {
    column?: ColumnId;
    delay: number;
    duration: number;
    row?: number;
    tooltip?: Tooltip;
}

interface IState {
    md?: Remarkable;
    display: boolean;
    displayTooltipId?: any;
    hideTooltipId?: any;
}

export default class CellTooltip extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            display: false
        };
    }

    componentWillReceiveProps(nextProps: IProps) {
        const { state } = this;
        const { column, row, tooltip } = this.props;

        if (column === nextProps.column && row === nextProps.row && tooltip === nextProps.tooltip) {
            return;
        }

        this.setState({
            display: false,
            displayTooltipId: Boolean(clearTimeout(state.displayTooltipId)) ||
                setTimeout(() => this.setState({ display: true }), this.props.delay),
            hideTooltipId: Boolean(clearTimeout(state.hideTooltipId)) ||
                setTimeout(() => this.setState({ display: false }), this.props.delay + this.props.duration)
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