import * as R from 'ramda';
import { CSSProperties } from 'react';

import { OptionalMap, OptionalProp, PropOf } from 'core/type';
import py2jsCssProperties from '../style/py2jsCssProperties';

export type Edge = any;

type BorderProp =
    PropOf<CSSProperties, 'borderBottom'> |
    PropOf<CSSProperties, 'borderLeft'> |
    PropOf<CSSProperties, 'borderRight'> |
    PropOf<CSSProperties, 'borderTop'>;

export type BorderStyle =
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

export const BORDER_PROPERTIES_AND_FRAGMENTS: string[] = R.uniq(
    R.filter(
        p => p.indexOf('border') === 0,
        Array.from(py2jsCssProperties.values())
    )
);

export class EdgesMatrix {
    private weights: number[][];
    private edges: Edge[][];

    constructor(
        public readonly rows: number,
        public readonly columns: number,
        defaultEdge?: Edge
    ) {
        this.weights = R.map(
            () => new Array(columns).fill(-Infinity),
            R.range(0, rows)
        );

        this.edges = R.map(
            () => new Array(columns).fill(defaultEdge),
            R.range(0, rows)
        );
    }

    setEdge(i: number, j: number, edge: Edge, weight: number, force: boolean = false) {
        if (!force && (R.isNil(edge) || weight <= this.weights[i][j])) {
            return;
        }

        this.weights[i][j] = weight;
        this.edges[i][j] = edge;
    }

    getEdge = (i: number, j: number) => this.edges[i][j];

    getEdges = () => this.edges;

    getWeight = (i: number, j: number) => this.weights[i][j];

    isDefault = (i: number, j: number) => !isFinite(this.weights[i][j]);
}

export class EdgesMatrices {
    private horizontal: EdgesMatrix;
    private vertical: EdgesMatrix;

    constructor(rows: number, columns: number, defaultEdge?: Edge) {
        this.horizontal = new EdgesMatrix(rows + 1, columns, defaultEdge);
        this.vertical = new EdgesMatrix(rows, columns + 1, defaultEdge);
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

    getEdges = () => ({
        horizontal: this.horizontal.getEdges(),
        vertical: this.vertical.getEdges()
    })

    getMatrices = () => ({
        horizontal: this.horizontal,
        vertical: this.vertical
    })

    getStyle = (i: number, j: number): CSSProperties => ({
        borderBottom: this.horizontal.getEdge(i + 1, j) || null,
        borderTop: this.horizontal.getEdge(i, j) || null,
        borderLeft: this.vertical.getEdge(i, j) || null,
        borderRight: this.vertical.getEdge(i, j + 1) || null
    })
}