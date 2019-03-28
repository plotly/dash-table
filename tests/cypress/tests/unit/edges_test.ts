import {derivedVerticalEdges} from 'dash-table/derived/edges/vertical';
import {derivedHorizontalEdges} from 'dash-table/derived/edges/vertical';
import {derivedRelevantCellStyles} from 'dash-table/derived/style';
import IStyle from 'dash-table/derived/style/IStyle';
import {generateMockData} from 'demo/data';

describe('derived edges', () => {
    const mock = generateMockData(10);
    const getDerivedVerticalEdges = derivedVerticalEdges();
    const getDerivedHorizontalEdges = derivedHorizontalEdges();
    const getRelevantStyles = derivedRelevantCellStyles();
    const styles = {
        border: '1px solid grey',
    } as IStyle;
    const relevantStyles = getRelevantStyles(styles, styles, [], []);
    const offset = {
        rows: 1,
        columns: 0,
    };

    describe('vertical edges matrix', () => {
        const vertical_edges = getDerivedVerticalEdges(
            mock.columns,
            mock.data as any,
            relevantStyles,
            offset
        );

        it('has length of columns.length + 1', () => {
            expect(vertical_edges[0].length).to.equal(mock.columns.length + 1);
        });
    });
    describe('horizontal edges matrix', () => {
        const horizontal_edges = getDerivedHorizontalEdges(
            mock.columns,
            mock.data as any,
            relevantStyles,
            offset
        );

        it('has length of data.length + 1', () => {
            expect(horizontal_edges.length).to.equal(mock.data.length + 1);
        });
    });
});
