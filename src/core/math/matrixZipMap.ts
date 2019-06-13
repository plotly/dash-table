type Matrix<T> = T[][];

export function shallowClone<T>(
    m: Matrix<T>
): Matrix<T> {
    const res = [];

    for (let i = 0; i < m.length; ++i) {
        res.push(m[i].slice(0));
    }

    return res;
}

export function traverse2<T1, T2>(
    a1: T1[],
    a2: T2[],
    fn: (d1: T1, d2: T2, i1: number, i2: number) => void
) {
    const _a1_ = a1.length;
    const _a2_ = a2.length;

    for (let i1 = 0; i1 < _a1_; ++i1) {
        for (let i2 = 0; i2 < _a2_; ++i2) {
            fn(a1[i1], a2[i2], i1, i2);
        }
    }
}

export function traverseMap2<T1, T2, TR>(
    a1: T1[],
    a2: T2[],
    fn: (d1: T1, d2: T2, i1: number, i2: number) => TR
): Matrix<TR> {
    const _a1_ = a1.length;
    const _a2_ = a2.length;

    const res: Matrix<TR> = [];

    for (let i1 = 0; i1 < _a1_; ++i1) {
        const row = [];
        for (let i2 = 0; i2 < _a2_; ++i2) {
            row.push(fn(a1[i1], a2[i2], i1, i2));
        }

        res.push(row);
    }

    return res;
}

export function matrixMap<T1, TR>(
    m1: Matrix<T1>,
    cb: (d1: T1, i: number, j: number) => TR
) {
    const _m1_ = m1.length;

    const res: Matrix<TR> = [];

    for (let i = 0; i < _m1_; ++i) {
        let row = [];
        for (let j = 0; j < m1[i].length; ++j) {
            row.push(cb(
                m1[i][j],
                i,
                j
            ));
        }

        res.push(row);
    }

    return res;
}

export function matrixMap2<T1, T2, TR>(
    m1: Matrix<T1>,
    m2: Matrix<T2> | undefined,
    cb: (d1: T1, d2: T2 | undefined, i: number, j: number) => TR
): Matrix<TR> {
    const _m1_ = m1.length;

    const res: Matrix<TR> = [];

    for (let i = 0; i < _m1_; ++i) {
        let row = [];
        for (let j = 0; j < m1[i].length; ++j) {
            row.push(cb(
                m1[i][j],
                m2 ? m2[i][j] : undefined,
                i,
                j
            ));
        }

        res.push(row);
    }

    return res;
}

export function matrixMap3<T1, T2, T3, TR>(
    m1: Matrix<T1>,
    m2: Matrix<T2> | undefined,
    m3: Matrix<T3> | undefined,
    cb: (d1: T1, d2: T2 | undefined, d3: T3 | undefined, i: number, j: number) => TR
): Matrix<TR> {
    const _m1_ = m1.length;

    const res: Matrix<TR> = [];

    for (let i = 0; i < _m1_; ++i) {
        let row = [];
        for (let j = 0; j < m1[i].length; ++j) {
            row.push(cb(
                m1[i][j],
                m2 ? m2[i][j] : undefined,
                m3 ? m3[i][j] : undefined,
                i,
                j
            ));
        }

        res.push(row);
    }

    return res;
}

export function matrixMap4<T1, T2, T3, T4, TR>(
    m1: Matrix<T1>,
    m2: Matrix<T2> | undefined,
    m3: Matrix<T3> | undefined,
    m4: Matrix<T4> | undefined,
    cb: (d1: T1, d2: T2 | undefined, d3: T3 | undefined, d4: T4 | undefined, i: number, j: number) => TR
): Matrix<TR> {
    const _m1_ = m1.length;

    const res: Matrix<TR> = [];

    for (let i = 0; i < _m1_; ++i) {
        let row = [];
        for (let j = 0; j < m1[i].length; ++j) {
            row.push(cb(
                m1[i][j],
                m2 ? m2[i][j] : undefined,
                m3 ? m3[i][j] : undefined,
                m4 ? m4[i][j] : undefined,
                i,
                j
            ));
        }

        res.push(row);
    }

    return res;
}

export function matrixMapN<TR>(
    cb: (i: number, j: number, ...args: any[]) => TR,
    m1: Matrix<any>,
    ...matrices: (any[][] | undefined)[]
) {
    const _m1_ = m1.length;

    const res: Matrix<TR> = [];

    for (let i = 0; i < _m1_; ++i) {
        let row = [];
        for (let j = 0; j < m1[i].length; ++j) {
            row.push(cb(
                m1[i][j],
                i,
                j,
                ...matrices.map(m => m ? m[i][j] : undefined)
            ));
        }

        res.push(row);
    }

    return res;
}