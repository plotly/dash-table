import * as R from 'ramda';

import { IUSerInterfaceTooltip, ITableTooltips, ITableStaticTooltips, IVirtualizedDerivedData } from 'dash-table/components/Table/props';
import { ifColumnId, ifRowIndex, ifFilter } from 'dash-table/conditional';
import { ConditionalTooltip, TooltipSyntax } from 'dash-table/tooltips/props';
import { memoizeOne } from 'core/memoizer';

function getSelectedTooltip(
    tooltip: IUSerInterfaceTooltip,
    tooltips: ITableTooltips | undefined,
    column_conditional_tooltips: ConditionalTooltip[],
    column_static_tooltip: ITableStaticTooltips,
    virtualized: IVirtualizedDerivedData
) {
    if (!tooltip) {
        return undefined;
    }

    const { id, row } = tooltip;

    if (id === undefined || row === undefined) {
        return undefined;
    }

    const legacyTooltip = tooltips &&
        tooltips[id] &&
        (
            tooltips[id].length > row ?
                tooltips[id][row] :
                null
        );

    const staticTooltip = column_static_tooltip[id];

    const conditionalTooltips = R.filter(tt => {
        return !tt.if ||
            (
                ifColumnId(tt.if, id) &&
                ifRowIndex(tt.if, row) &&
                ifFilter(tt.if, virtualized.data[row - virtualized.offset.rows])
            );
    }, column_conditional_tooltips);

    return conditionalTooltips.length ?
        conditionalTooltips.slice(-1)[0] :
        legacyTooltip || staticTooltip;
}

export default memoizeOne((
    tooltip: IUSerInterfaceTooltip,
    tooltips: ITableTooltips | undefined,
    column_conditional_tooltips: ConditionalTooltip[],
    column_static_tooltip: ITableStaticTooltips,
    virtualized: IVirtualizedDerivedData,
    defaultDelay: number,
    defaultDuration: number
) => {
    const selectedTooltip = getSelectedTooltip(
        tooltip,
        tooltips,
        column_conditional_tooltips,
        column_static_tooltip,
        virtualized
    );

    let delay: number = defaultDelay;
    let duration: number = defaultDuration;
    let type: TooltipSyntax = TooltipSyntax.Text;
    let value: string | undefined;

    if (selectedTooltip) {
        if (typeof selectedTooltip === 'string') {
            value = selectedTooltip;
        } else {
            type = selectedTooltip.type || TooltipSyntax.Text;
            value = selectedTooltip.value;
            delay = typeof tooltip.delay === 'number' ? tooltip.delay : defaultDelay;
            duration = typeof tooltip.duration === 'number' ? tooltip.duration : defaultDuration;
        }
    }

    return { delay, duration, type, value };
});