import { ConditionalDataCell } from 'dash-table/conditional';
import { ColumnId } from 'dash-table/components/Table/props';

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
export type StaticTooltip = ITooltip & { id: ColumnId };