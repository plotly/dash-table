import { CSSProperties } from 'react';

interface IAttributes {
    [key: string]: string | number | boolean;
}

export interface ICellProps {
    active: boolean;
    classes: string;
    attributes: IAttributes;
    style?: CSSProperties;
}

export type ICellPropsWithDefaults = ICellProps;
