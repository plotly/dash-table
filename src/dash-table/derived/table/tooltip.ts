import * as R from 'ramda';

import {
    IUSerInterfaceTooltip,
    ITableStaticTooltips,
    IVirtualizedDerivedData,
    DataTooltips
} from 'dash-table/components/Table/props';
import {ifColumnId, ifRowIndex, ifFilter} from 'dash-table/conditional';
import {
    ConditionalTooltip,
    TooltipUsage,
    TooltipSyntax
} from 'dash-table/tooltips/props';
import {memoizeOne} from 'core/memoizer';

// 2^32-1 the largest value setTimout can take safely
export const MAX_32BITS = 2147483647;

function getSelectedTooltip(
    currentTooltip: IUSerInterfaceTooltip,
    tooltip_data: DataTooltips,
    tooltip_header: DataTooltips,
    tooltip_conditional: ConditionalTooltip[],
    tooltip_static: ITableStaticTooltips,
    virtualized: IVirtualizedDerivedData
) {
    if (!currentTooltip) {
        return undefined;
    }

    const {header, id, row} = currentTooltip;

    const tooltip_source = header ? tooltip_header : tooltip_data;

    if (id === undefined || row === undefined) {
        return undefined;
    }

    const staticTooltip = tooltip_static?.[id];
    const staticUseWith =
        staticTooltip && typeof staticTooltip !== 'string'
            ? staticTooltip.use_with
            : TooltipUsage.Both;
    const staticApplicable =
        staticUseWith === TooltipUsage.Both ||
        (staticUseWith === TooltipUsage.Header) === header;
    const resolvedStaticTooltip = staticApplicable ? staticTooltip : undefined;

    const appliedStaticTooltip =
        tooltip_source?.[row]?.[id] || resolvedStaticTooltip;

    const conditionalTooltips = header
        ? []
        : R.filter(tt => {
              return (
                  !tt.if ||
                  (ifColumnId(tt.if, id) &&
                      ifRowIndex(tt.if, row) &&
                      ifFilter(
                          tt.if,
                          virtualized.data[row - virtualized.offset.rows]
                      ))
              );
          }, tooltip_conditional);

    return conditionalTooltips.length
        ? conditionalTooltips.slice(-1)[0]
        : appliedStaticTooltip;
}

function convertDelay(delay: number | null) {
    return typeof delay === 'number' ? delay : 0;
}

function convertDuration(duration: number | null) {
    return typeof duration === 'number' ? duration : MAX_32BITS;
}

function getDelay(delay: number | null | undefined, defaultTo: number) {
    return typeof delay === 'number' || delay === null
        ? convertDelay(delay)
        : defaultTo;
}

function getDuration(duration: number | null | undefined, defaultTo: number) {
    return typeof duration === 'number' || duration === null
        ? convertDuration(duration)
        : defaultTo;
}

export default memoizeOne(
    (
        currentTooltip: IUSerInterfaceTooltip,
        tooltip_data: DataTooltips,
        tooltip_header: DataTooltips,
        tooltip_conditional: ConditionalTooltip[],
        tooltip_static: ITableStaticTooltips,
        virtualized: IVirtualizedDerivedData,
        defaultDelay: number | null,
        defaultDuration: number | null
    ) => {
        const selectedTooltip = getSelectedTooltip(
            currentTooltip,
            tooltip_data,
            tooltip_header,
            tooltip_conditional,
            tooltip_static,
            virtualized
        );

        let delay = convertDelay(defaultDelay) as number;
        let duration = convertDuration(defaultDuration) as number;

        let type: TooltipSyntax = TooltipSyntax.Text;
        let value: string | undefined;

        if (selectedTooltip) {
            if (typeof selectedTooltip === 'string') {
                value = selectedTooltip;
            } else {
                delay = getDelay(selectedTooltip.delay, delay);
                duration = getDuration(selectedTooltip.duration, duration);
                type = selectedTooltip.type || TooltipSyntax.Text;
                value = selectedTooltip.value;
            }
        }

        return {delay, duration, type, value};
    }
);
