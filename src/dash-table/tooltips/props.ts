import { ConditionalDataCell } from 'dash-table/conditional';

export enum TooltipSyntax {
    Text = 'text',
    Markdown = 'markdown'
}

export interface ITooltip {
    type?: TooltipSyntax;
    value: string;
}

export type Tooltip = string | ITooltip;
export type ConditionalTooltip = ITooltip & { if: ConditionalDataCell };