import dataEdges from 'dash-table/derived/edges/data';

describe('data edges', () => {
    const edgesFn = dataEdges();

    it('without data has no edges', () => {
        const res = edgesFn(
            [{ id: 'id', name: 'id' }],
            [],
            [],
            { columns: 0, rows: 0 }
        );

        expect(res !== undefined).to.equal(false);
    });

    it('without one data row', () => {
        const res = edgesFn(
            [],
            [],
            [{ id: 1 }],
            { columns: 0, rows: 0 }
        );

        expect(res !== undefined).to.equal(false);
    });

    it('uses `undefined` default style', () => {
        const res = edgesFn(
            [{ id: 'id', name: 'id' }],
            [],
            [{ id: 1 }],
            { columns: 0, rows: 0 }
        );

        expect(res !== undefined).to.equal(true);
        if (res) {
            const { horizontal, vertical } = res.getEdges();

            expect(horizontal.length).to.equal(2);
            expect(horizontal[0].length).to.equal(1);
            expect(horizontal[1].length).to.equal(1);
            expect(horizontal[0][0] === undefined).to.equal(true);
            expect(horizontal[1][0] === undefined).to.equal(true);

            expect(vertical.length).to.equal(1);
            expect(vertical[0].length).to.equal(2);
            expect(vertical[0][0] === undefined).to.equal(true);
            expect(vertical[0][1] === undefined).to.equal(true);
        }
    });

    it('uses default style', () => {
        const res = edgesFn(
            [{ id: 'id', name: 'id' }],
            [],
            [{ id: 1 }],
            { columns: 0, rows: 0 }
        );

        expect(res !== undefined).to.equal(true);
        if (res) {
            const { horizontal, vertical } = res.getEdges();

            expect(horizontal.length).to.equal(2);
            expect(horizontal[0].length).to.equal(1);
            expect(horizontal[1].length).to.equal(1);
            expect(horizontal[0][0]).to.equal(undefined);
            expect(horizontal[1][0]).to.equal(undefined);

            expect(vertical.length).to.equal(1);
            expect(vertical[0].length).to.equal(2);
            expect(vertical[0][0]).to.equal(undefined);
            expect(vertical[0][1]).to.equal(undefined);
        }
    });

    it('uses default style on multiple rows & columns', () => {
        const res = edgesFn(
            [
                { id: 'id', name: 'id' },
                { id: 'name', name: 'name' }
            ],
            [],
            [
                { id: 1, name: 'a' },
                { id: 1, name: 'b' },
                { id: 2, name: 'a' },
                { id: 2, name: 'b' }
            ],
            { columns: 0, rows: 0 }
        );

        expect(res !== undefined).to.equal(true);
        if (res) {
            const { horizontal, vertical } = res.getEdges();

            expect(horizontal.length).to.equal(5);
            horizontal.forEach(edges => {
                expect(edges.length).to.equal(2);

                edges.forEach(edge => {
                    expect(edge).to.equal(undefined);
                });
            });

            expect(vertical.length).to.equal(4);
            vertical.forEach(edges => {
                expect(edges.length).to.equal(3);

                edges.forEach(edge => {
                    expect(edge).to.equal(undefined);
                });
            });
        }
    });

    it('applies `border`', () => {
        const res = edgesFn(
            [
                { id: 'id', name: 'id' },
                { id: 'name', name: 'name' }
            ],
            [{
                style: { border: '1px solid green' },
                matchesColumn: () => true,
                matchesFilter: () => true,
                matchesRow: () => true
            }],
            [
                { id: 1, name: 'a' },
                { id: 1, name: 'b' },
                { id: 2, name: 'a' },
                { id: 2, name: 'b' }
            ],
            { columns: 0, rows: 0 }
        );

        expect(res !== undefined).to.equal(true);
        if (res) {
            const { horizontal, vertical } = res.getEdges();

            expect(horizontal.length).to.equal(5);
            horizontal.forEach(edges => {
                expect(edges.length).to.equal(2);

                edges.forEach(edge => {
                    expect(edge).to.equal('1px solid green');
                });
            });

            expect(vertical.length).to.equal(4);
            vertical.forEach(edges => {
                expect(edges.length).to.equal(3);

                edges.forEach(edge => {
                    expect(edge).to.equal('1px solid green');
                });
            });
        }
    });

    it('applies `borderLeft` and `borderTop`', () => {
        const res = edgesFn(
            [
                { id: 'id', name: 'id' },
                { id: 'name', name: 'name' }
            ],
            [{
                style: { borderLeft: '1px solid green', borderTop: '1px solid darkgreen' },
                matchesColumn: () => true,
                matchesFilter: () => true,
                matchesRow: () => true
            }],
            [
                { id: 1, name: 'a' },
                { id: 1, name: 'b' },
                { id: 2, name: 'a' },
                { id: 2, name: 'b' }
            ],
            { columns: 0, rows: 0 }
        );

        expect(res !== undefined).to.equal(true);
        if (res) {
            const { horizontal, vertical } = res.getEdges();

            expect(horizontal.length).to.equal(5);
            horizontal.forEach((edges, rowIndex) => {
                expect(edges.length).to.equal(2);

                edges.forEach(edge => {
                    expect(edge).to.equal(rowIndex === horizontal.length - 1 ?
                        undefined :
                        '1px solid darkgreen'
                    );
                });
            });

            expect(vertical.length).to.equal(4);
            vertical.forEach(edges => {
                expect(edges.length).to.equal(3);

                edges.forEach((edge, index) => {
                    expect(edge).to.equal(index === edges.length - 1 ?
                        undefined :
                        '1px solid green'
                    );
                });
            });
        }
    });

    it('applies `borderLeft` overridden by higher precedence `borderRight`', () => {
        const res = edgesFn(
            [
                { id: 'id', name: 'id' },
                { id: 'name', name: 'name' }
            ],
            [{
                style: { borderLeft: '1px solid green' },
                matchesColumn: () => true,
                matchesFilter: () => true,
                matchesRow: () => true
            }, {
                style: { borderRight: '1px solid darkgreen' },
                matchesColumn: () => true,
                matchesFilter: () => true,
                matchesRow: () => true
            }],
            [
                { id: 1, name: 'a' }
            ],
            { columns: 0, rows: 0 }
        );

        expect(res !== undefined).to.equal(true);
        if (res) {
            const { vertical } = res.getEdges();

            expect(vertical.length).to.equal(1);
            expect(vertical[0].length).to.equal(3);
            expect(vertical[0][0]).to.equal('1px solid green');
            expect(vertical[0][1]).to.equal('1px solid darkgreen');
            expect(vertical[0][2]).to.equal('1px solid darkgreen');
        }
    });

    it('applies `borderLeft` not overridden by lower precedence `borderRight`', () => {
        const res = edgesFn(
            [
                { id: 'id', name: 'id' },
                { id: 'name', name: 'name' }
            ],
            [{
                style: { borderRight: '1px solid darkgreen' },
                matchesColumn: () => true,
                matchesFilter: () => true,
                matchesRow: () => true
            }, {
                style: { borderLeft: '1px solid green' },
                matchesColumn: () => true,
                matchesFilter: () => true,
                matchesRow: () => true
            }],
            [
                { id: 1, name: 'a' }
            ],
            { columns: 0, rows: 0 }
        );

        expect(res === undefined).to.equal(false);
        if (res) {
            const { vertical } = res.getEdges();

            expect(vertical.length).to.equal(1);
            expect(vertical[0].length).to.equal(3);
            expect(vertical[0][0]).to.equal('1px solid green');
            expect(vertical[0][1]).to.equal('1px solid green');
            expect(vertical[0][2]).to.equal('1px solid darkgreen');
        }
    });

    it('applies `borderLeft` overridden by higher precedence `border`', () => {
        const res = edgesFn(
            [
                { id: 'id', name: 'id' },
                { id: 'name', name: 'name' }
            ],
            [{
                style: { borderLeft: '1px solid darkgreen' },
                matchesColumn: () => true,
                matchesFilter: () => true,
                matchesRow: () => true
            }, {
                style: { border: '1px solid green' },
                matchesColumn: () => true,
                matchesFilter: () => true,
                matchesRow: () => true
            }],
            [
                { id: 1, name: 'a' }
            ],
            { columns: 0, rows: 0 }
        );

        expect(res !== undefined).to.equal(true);
        if (res) {
            const { vertical } = res.getEdges();

            expect(vertical.length).to.equal(1);
            expect(vertical[0].length).to.equal(3);
            expect(vertical[0][0]).to.equal('1px solid green');
            expect(vertical[0][1]).to.equal('1px solid green');
            expect(vertical[0][2]).to.equal('1px solid green');
        }
    });
});