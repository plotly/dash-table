import * as R from 'ramda';
import React, { PureComponent } from 'react';

import DOM from 'core/browser/DOM';

import { ColumnId, IVirtualizedDerivedData, ITableStaticTooltips, ITableTooltips } from '../Table/props';
import { Tooltip, ConditionalTooltip } from 'dash-table/tooltips/props';
import SyntaxTree from 'core/syntax-tree';

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
                (
                    (
                        tt.if.column_id === undefined ||
                        tt.if.column_id === columnId
                    ) &&
                    (
                        tt.if.row_index === undefined ||
                        tt.if.row_index === realIndex ||
                        (tt.if.row_index === 'odd' && realIndex % 2 === 1) ||
                        (tt.if.row_index === 'even' && realIndex % 2 === 0)
                    ) &&
                    (
                        tt.if.filter === undefined ||
                        (() => {
                            const ast = new SyntaxTree(tt.if.filter);
                            return ast.isValid && ast.evaluate(
                                this.props.virtualized.data[realIndex - this.props.virtualized.offset.rows]
                            );
                        })()
                    )
                );
        }, column_conditional_tooltips);

        return conditionalTooltips.length ?
            conditionalTooltips[0] :
            legacyTooltip || staticTooltip;
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
                        tooltip.type === 'markdown' ?
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