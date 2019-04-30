import * as R from 'ramda';

type Matrix<T> = T[][];

export function matrixMap<T1, TR>(
    m1: Matrix<T1>,
    cb: (d1: T1, i: number, j: number) => TR
) {
    const mapMatrix = R.addIndex<T1[], TR[]>(R.map);
    const mapRow = R.addIndex<T1, TR>(R.map);

    return mapMatrix((iRow, i) =>
        mapRow(
            (ijValue, j) => cb(ijValue, i, j),
            iRow
        ), m1
    );
}

export function matrixMap2<T1, T2, TR>(
    m1: Matrix<T1>,
    m2: Matrix<T2> | undefined,
    cb: (d1: T1, d2: T2 | undefined, i: number, j: number) => TR
) {
    const mapMatrix = R.addIndex<T1[], TR[]>(R.map);
    const mapRow = R.addIndex<T1, TR>(R.map);

    return mapMatrix((iRow, i) =>
        mapRow(
            (ijValue, j) => cb(
                ijValue,
                m2 ? m2[i][j] : undefined,
                i,
                j
            ),
            iRow
        ), m1
    );
}

export function matrixMap3<T1, T2, T3, TR>(
    m1: Matrix<T1>,
    m2: Matrix<T2> | undefined,
    m3: Matrix<T3> | undefined,
    cb: (d1: T1, d2: T2 | undefined, d3: T3 | undefined, i: number, j: number) => TR
) {
    const mapMatrix = R.addIndex<T1[], TR[]>(R.map);
    const mapRow = R.addIndex<T1, TR>(R.map);

    return mapMatrix((iRow, i) =>
        mapRow(
            (ijValue, j) => cb(
                ijValue,
                m2 ? m2[i][j] : undefined,
                m3 ? m3[i][j] : undefined,
                i,
                j
            ),
            iRow
        ), m1
    );
}

export function matrixMap4<T1, T2, T3, T4, TR>(
    m1: Matrix<T1>,
    m2: Matrix<T2> | undefined,
    m3: Matrix<T3> | undefined,
    m4: Matrix<T4> | undefined,
    cb: (d1: T1, d2: T2 | undefined, d3: T3 | undefined, d4: T4 | undefined, i: number, j: number) => TR
) {
    const mapMatrix = R.addIndex<T1[], TR[]>(R.map);
    const mapRow = R.addIndex<T1, TR>(R.map);

    return mapMatrix((iRow, i) =>
        mapRow(
            (ijValue, j) => cb(
                ijValue,
                m2 ? m2[i][j] : undefined,
                m3 ? m3[i][j] : undefined,
                m4 ? m4[i][j] : undefined,
                i,
                j
            ),
            iRow
        ), m1
    );
}

export function matrixMapN<TR>(
    cb: (i: number, j: number, ...args: any[]) => TR,
    m1: Matrix<any>,
    ...matrices: (any[][] | undefined)[]
) {
    const mapMatrix = R.addIndex<any[], TR[]>(R.map);
    const mapRow = R.addIndex<any, TR>(R.map);

    return mapMatrix((iRow, i) =>
        mapRow(
            (ijValue, j) => cb(
                i,
                j,
                [
                    ijValue,
                    m1[i][j],
                    ...matrices.map(m => m ? m[i][j] : undefined)
                ]
            ),
            iRow
        ), m1
    );
}