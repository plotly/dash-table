import * as R from 'ramda';
import { CSSProperties } from 'react';

import { OptionalMap, OptionalProp, PropOf } from 'core/type';

interface IEdges {
    horizontal: Edge[][];
    vertical: Edge[][];
}

export interface IDefaultBorderStyle {
    vertical?: string;
    horizontal?: string;
}

export type BorderProp =
    PropOf<CSSProperties, 'borderBottom'> |
    PropOf<CSSProperties, 'borderLeft'> |
    PropOf<CSSProperties, 'borderRight'> |
    PropOf<CSSProperties, 'borderTop'>;

export type BorderStyle =
    OptionalMap<CSSProperties, 'border', [OptionalProp<CSSProperties, 'border'>, number]> &
    OptionalMap<CSSProperties, 'borderBottom', [OptionalProp<CSSProperties, 'borderBottom'>, number]> &
    OptionalMap<CSSProperties, 'borderLeft', [OptionalProp<CSSProperties, 'borderLeft'>, number]> &
    OptionalMap<CSSProperties, 'borderRight', [OptionalProp<CSSProperties, 'borderRight'>, number]> &
    OptionalMap<CSSProperties, 'borderTop', [OptionalProp<CSSProperties, 'borderTop'>, number]>;

export const BORDER_PROPERTIES: BorderProp[] = [
    'borderBottom',
    'borderLeft',
    'borderRight',
    'borderTop'
];

export type Edge = any;

export type Edges = IEdges | undefined;

export class EdgesMatrix {
    private weights: number[][];
    private edges: Edge[][];

    constructor(rows: number, columns: number, defaultBorderStyle?: Edge) {
        this.weights = R.map(
            () => new Array(columns).fill(-Infinity),
            R.range(0, rows)
        );

        this.edges = R.map(
            () => new Array(columns).fill(defaultBorderStyle),
            R.range(0, rows)
        );
    }

    setEdge(i: number, j: number, edge: Edge, weight: number) {
        if (R.isNil(edge) || weight <= this.weights[i][j]) {
            return;
        }

        this.weights[i][j] = weight;
        this.edges[i][j] = edge;
    }

    getEdges() {
        return this.edges;
    }
}

export class EdgesMatrices {
    private horizontal: EdgesMatrix;
    private vertical: EdgesMatrix;

    constructor(rows: number, columns: number, defaultBorderStyle?: IDefaultBorderStyle) {
        this.horizontal = new EdgesMatrix(
            rows + 1,
            columns,
            defaultBorderStyle && defaultBorderStyle.horizontal
        );
        this.vertical = new EdgesMatrix(
            rows,
            columns + 1,
            defaultBorderStyle && defaultBorderStyle.vertical
        );
    }

    setEdges(i: number, j: number, style: BorderStyle) {
        if (style.borderTop) {
            this.horizontal.setEdge(i, j, style.borderTop[0], style.borderTop[1]);
        }

        if (style.borderBottom) {
            this.horizontal.setEdge(i + 1, j, style.borderBottom[0], style.borderBottom[1]);
        }

        if (style.borderLeft) {
            this.vertical.setEdge(i, j, style.borderLeft[0], style.borderLeft[1]);
        }

        if (style.borderRight) {
            this.vertical.setEdge(i, j + 1, style.borderRight[0], style.borderRight[1]);
        }
    }

    getMatrices() {
        return {
            horizontal: this.horizontal.getEdges(),
            vertical: this.vertical.getEdges()
        };
    }
}