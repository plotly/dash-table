import {derivedVerticalEdges} from 'dash-table/derived/edges/vertical';
import {generateMockData} from 'demo/data';

describe('derived edges', () => {
    describe('vertical edges', () => {
        it('builds a matrix containing vertical edges', () => {
            const getDerivedVerticalEdges = derivedVerticalEdges();
            const mock = generateMockData(10);
            const vertical_edges = getDerivedVerticalEdges(mock.columns, mock.data as any);
            expect(vertical_edges[0].length).to.equal(mock.columns.length + 1);
        });
    });
});
