import * as R from 'ramda';
import React, { PureComponent } from 'react';

import DOM from 'core/browser/DOM';

import { ifColumnId, ifRowIndex, ifFilter } from 'dash-table/conditional';
import { Tooltip, ConditionalTooltip, TooltipSyntax } from 'dash-table/tooltips/props';

import { ColumnId, IVirtualizedDerivedData, ITableStaticTooltips, ITableTooltips } from '../Table/props';

interface IProps {
    column_static_tooltip: ITableStaticTooltips;
    column_conditional_tooltips: ConditionalTooltip[];
    delay: number;
    tooltips?: ITableTooltips;
    virtualized: IVirtualizedDerivedData;
}

interface IState {
    columnId?: ColumnId;
    md?: Remarkable;
    displayTooltip?: boolean;
    pageX?: number;
    pageY?: number;
    rowIndex?: number;
    tooltipTimeoutId?: any;
}

export default class TooltipCursorDecorator extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    private getTooltip(): Tooltip | undefined {
        const { pageX, pageY, columnId, rowIndex } = this.state;
        const { tooltips, column_conditional_tooltips, column_static_tooltip } = this.props;

        if (pageX === undefined || pageY === undefined || columnId === undefined || rowIndex === undefined) {
            return undefined;
        }

        const { virtualized } = this.props;

        const realIndex = rowIndex + virtualized.offset.rows;

        const legacyTooltip = tooltips &&
            tooltips[columnId] &&
            (
                tooltips[columnId].length > realIndex ?
                    tooltips[columnId][realIndex] :
                    null
            );

        const staticTooltip = column_static_tooltip[columnId];

        const conditionalTooltips = R.filter(tt => {
            return !tt.if ||
                ifColumnId(tt.if, columnId) ||
                ifRowIndex(tt.if, realIndex) ||
                ifFilter(tt.if, this.props.virtualized.data[realIndex - this.props.virtualized.offset.rows]);
        }, column_conditional_tooltips);

        return conditionalTooltips.length ?
            conditionalTooltips[0] :
            legacyTooltip || staticTooltip;
    }

    componentDidUpdate() {
        const { tooltip } = this.refs as { [key: string]: HTMLElement };
        if (!tooltip) {
            return;
        }

        // x-axis view start / end
        const xvs = document.body.offsetLeft;
        const xve = document.body.offsetLeft + document.body.clientWidth;

        // x-asix tooltip start / end
        const xts = tooltip.offsetLeft;
        const xte = tooltip.offsetLeft + tooltip.clientWidth;

        // x-axis view-tooltip delta start / end
        // positive: tooltip is in the view
        // negative: tooltip is out of view
        // inverted to keep the same meaning on both sides
        const xds = xts - xvs;
        const xde = xve - xte;

        if (xde >= 0) {
            return;
        }

        // the tooltip can only exceed the view in one direction (right)
        // bound the adjustment to whatever is smallest (the right excess, or the left space)
        tooltip.style.marginLeft = `${Math.max(xde, -xds)}px`;
    }

    render() {
        let children = (this.props as any).children;

        const { displayTooltip } = this.state;

        let tooltip = (displayTooltip || undefined) && this.getTooltip();

        let tooltipComponent;
        if (tooltip && !this.state.md) {
            import(/* webpackChunkName: "markdown" */ 'remarkable')
                .then(lib => lib.default)
                .then(Remarkable => {
                    this.setState({ md: new Remarkable() });
                });
            tooltipComponent = null;
        }

        tooltipComponent = (!tooltip || !this.state.md) ?
            null :
            (<div
                className='dash-table-tooltip'
                ref='tooltip'
                style={{
                    left: this.state.pageX,
                    top: this.state.pageY
                }}
                dangerouslySetInnerHTML={{
                    __html: typeof tooltip === 'string' ?
                        tooltip :
                        tooltip.type === TooltipSyntax.Markdown ?
                            this.state.md.render(tooltip.value) :
                            tooltip.value
                }}
            />);

        children = Array.isArray(children) ?
            [...children, tooltipComponent] :
            [children, tooltipComponent];

        return (<div
            children={children}
            style={{ position: 'relative' }}
            onMouseMove={ev => {
                const td = DOM.getFirstParentOfType(ev.target as any, 'td');

                const { pageX, pageY } = ev;

                this.setState(state => ({
                    columnId: td && (td.getAttribute('data-dash-column') || undefined),
                    displayTooltip: false,
                    pageX: pageX,
                    pageY: pageY,
                    rowIndex: td && parseInt(td.getAttribute('data-dash-row') || '', 10),
                    tooltipTimeoutId: Boolean(clearTimeout(state.tooltipTimeoutId)) || setTimeout(() => this.setState({ displayTooltip: true }), this.props.delay)
                }));
            }}
            onMouseLeave={() => {
                this.setState(state => ({
                    columnId: undefined,
                    displayTooltip: false,
                    pageX: undefined,
                    pageY: undefined,
                    rowIndex: undefined,
                    tooltipTimeoutId: clearTimeout(state.tooltipTimeoutId)
                }));
            }}
            onScroll={() => {
                const { pageX, pageY } = this.state;

                if (pageX === undefined || pageY === undefined) {
                    return;
                }

                const target = document.elementFromPoint(pageX, pageY);
                const td = DOM.getFirstParentOfType(target as any, 'td');

                this.setState(state => ({
                    columnId: td && (td.getAttribute('data-dash-column') || undefined),
                    rowIndex: td && parseInt(td.getAttribute('data-dash-row') || '', 10),
                    tooltipTimeoutId: Boolean(clearTimeout(state.tooltipTimeoutId)) || setTimeout(() => this.setState({ displayTooltip: true }), this.props.delay)
                }));
            }}
        />);
    }
}