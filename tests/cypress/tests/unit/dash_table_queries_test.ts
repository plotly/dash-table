import * as R from 'ramda';

import SyntaxTree from 'core/syntax-tree';

import { QuerySyntaxTree, MultiColumnsSyntaxTree, SingleColumnSyntaxTree } from 'dash-table/syntax-tree';

export interface ICase {
    name: string;
    query: string;
    target: object;
    valid: boolean;
    evaluate?: boolean;
}

export function processCases(getSyntaxer: (query: string) => SyntaxTree, cases: ICase[]) {
    R.forEach(c => it(c.name, () => {
        const tree = getSyntaxer(c.query);

        expect(tree.isValid).to.equal(c.valid);
        if (!c.valid) {
            return;
        }

        expect(tree.evaluate(c.target)).to.equal(c.evaluate);
    }), cases);
}
const getQuerySyntaxTree = (query: string): any => new QuerySyntaxTree(query);
const getMultiColumnSyntaxTree = (query: string): any => new MultiColumnsSyntaxTree(query);
const getSingleColumnSyntaxTree = (query: string): any => new SingleColumnSyntaxTree(query, {
    column: {
        id: 'a'
    }
});

describe('Dash Table Queries', () => {
    R.forEach(c => {
        describe(c.name, () => {
            describe('relational operator', () => {
                describe('eq', () => {
                    processCases(c.syntaxer, [
                        { name: 'compares "1" to 1', query: `${c.hideOperand ? '' : '{a} '}eq 1`, target: { a: '1' }, valid: true, evaluate: true },
                        { name: 'compares "1" to "1"', query: `${c.hideOperand ? '' : '{a} '}eq "1"`, target: { a: '1' }, valid: true, evaluate: true },
                        { name: 'compares "1.0" to 1', query: `${c.hideOperand ? '' : '{a} '}eq 1`, target: { a: '1.0' }, valid: true, evaluate: true },
                        { name: 'compares "1.0" to "1"', query: `${c.hideOperand ? '' : '{a} '}eq "1"`, target: { a: '1.0' }, valid: true, evaluate: true },
                        { name: 'compares "1.1" to 1', query: `${c.hideOperand ? '' : '{a} '}eq 1`, target: { a: '1.1' }, valid: true, evaluate: false },
                        { name: 'compares "1.1" to "1"', query: `${c.hideOperand ? '' : '{a} '}eq "1"`, target: { a: '1.1' }, valid: true, evaluate: false },
                        { name: 'compares "1" to 0x1', query: `${c.hideOperand ? '' : '{a} '}eq 0x1`, target: { a: '1' }, valid: true, evaluate: true },
                        { name: 'compares "1" to "0x1"', query: `${c.hideOperand ? '' : '{a} '}eq "0x1"`, target: { a: '1' }, valid: true, evaluate: true },

                        { name: 'compares 1 to 1', query: `${c.hideOperand ? '' : '{a} '}eq 1`, target: { a: 1 }, valid: true, evaluate: true },
                        { name: 'compares 1 to "1"', query: `${c.hideOperand ? '' : '{a} '}eq "1"`, target: { a: 1 }, valid: true, evaluate: true },
                        { name: 'compares 1.1 to 1', query: `${c.hideOperand ? '' : '{a} '}eq 1`, target: { a: 1.1 }, valid: true, evaluate: false },
                        { name: 'compares 1.1 to "1"', query: `${c.hideOperand ? '' : '{a} '}eq "1"`, target: { a: 1.1 }, valid: true, evaluate: false },
                        { name: 'compares 1 to 0x1', query: `${c.hideOperand ? '' : '{a} '}eq 0x1`, target: { a: 1 }, valid: true, evaluate: true },
                        { name: 'compares 1 to "0x1"', query: `${c.hideOperand ? '' : '{a} '}eq "0x1"`, target: { a: 1 }, valid: true, evaluate: true },

                        { name: 'compares "x1" to 1', query: `${c.hideOperand ? '' : '{a} '}eq 1`, target: { a: 'x1' }, valid: true, evaluate: false },
                        { name: 'compares "x1" to "1"', query: `${c.hideOperand ? '' : '{a} '}eq "1"`, target: { a: 'x1' }, valid: true, evaluate: false }
                    ]);
                });

                describe('contains', () => {
                    processCases(c.syntaxer, [
                        { name: 'cannot compare "11" to 1', query: `${c.hideOperand ? '' : '{a} '}contains 1`, target: { a: '11' }, valid: true, evaluate: false },
                        { name: 'cannot compare 11 to 1', query: `${c.hideOperand ? '' : '{a} '}contains 1`, target: { a: 11 }, valid: true, evaluate: false },
                        { name: 'compares "11" to "1"', query: `${c.hideOperand ? '' : '{a} '}contains "1"`, target: { a: '11' }, valid: true, evaluate: true },
                        { name: 'compares 11 to "1"', query: `${c.hideOperand ? '' : '{a} '}contains "1"`, target: { a: 11 }, valid: true, evaluate: true },
                        { name: 'compares "1" to "1.0"', query: `${c.hideOperand ? '' : '{a} '}contains "1.0"`, target: { a: '1' }, valid: true, evaluate: false },
                        { name: 'compares 1 to "1.0"', query: `${c.hideOperand ? '' : '{a} '}contains "1.0"`, target: { a: 1 }, valid: true, evaluate: false }
                    ]);
                });

                describe('in', () => {
                    processCases(c.syntaxer, [
                        { name: '0yyy in "0"', query: `${c.hideOperand ? '' : '{a} '}in "0"`, target: { a: '0987' }, valid: true, evaluate: false },
                        { name: '0yyy in "0yyy"', query: `${c.hideOperand ? '' : '{a} '}in "0987"`, target: { a: '0987' }, valid: true, evaluate: true },
                        { name: 'yyyy in "yyyy"', query: `${c.hideOperand ? '' : '{a} '}in "2006"`, target: { a: '2005' }, valid: true, evaluate: false },
                        { name: 'yyyy in "yyyy"', query: `${c.hideOperand ? '' : '{a} '}in "2005"`, target: { a: '2005' }, valid: true, evaluate: true },
                        { name: 'yyyy in yyyy', query: `${c.hideOperand ? '' : '{a} '}in 2005`, target: { a: '2005' }, valid: true, evaluate: false },
                        { name: 'yyyy-mm in "yyyy"', query: `${c.hideOperand ? '' : '{a} '}in "2005"`, target: { a: '2005-01' }, valid: true, evaluate: true },
                        { name: 'yyyy-mm-dd in "yyyy"', query: `${c.hideOperand ? '' : '{a} '}in "2005"`, target: { a: '2005-01-01' }, valid: true, evaluate: true },
                        { name: 'yyyy-mm-dd hh in "yyyy"', query: `${c.hideOperand ? '' : '{a} '}in "2005"`, target: { a: '2005-01-01T10' }, valid: true, evaluate: true },
                        { name: 'yyyy-mm-dd hh:mm in "yyyy"', query: `${c.hideOperand ? '' : '{a} '}in "2005"`, target: { a: '2005-01-01T10:00' }, valid: true, evaluate: true },
                        { name: 'yyyy-mm-dd hh:mm:ss in "yyyy"', query: `${c.hideOperand ? '' : '{a} '}in "2005"`, target: { a: '2005-01-01 10:00:00' }, valid: true, evaluate: true },
                        { name: 'yyyy-mm-dd hh:mm:ss.xxx in "yyyy"', query: `${c.hideOperand ? '' : '{a} '}in "2005"`, target: { a: '2005-01-01 10:00:00.000' }, valid: true, evaluate: true },
                        { name: 'yyyy-mm-dd hh:mm:ss.xxxxxxxxx in "yyyy"', query: `${c.hideOperand ? '' : '{a} '}in "2005"`, target: { a: '2005-01-01 10:00:00.000000000' }, valid: true, evaluate: true },
                        { name: 'yyyy in yyyy-mm', query: `${c.hideOperand ? '' : '{a} '}in 2005-01`, target: { a: '2005' }, valid: true, evaluate: false },
                        { name: 'yyyy-mm in yyyy-mm', query: `${c.hideOperand ? '' : '{a} '}in 2005-01`, target: { a: '2005-01' }, valid: true, evaluate: true },
                        { name: 'yyyy-mm in "yyyy-mm"', query: `${c.hideOperand ? '' : '{a} '}in "2005-01"`, target: { a: '2005-01' }, valid: true, evaluate: true },
                        { name: 'yyyy-mm-dd in yyyy-mm', query: `${c.hideOperand ? '' : '{a} '}in 2005-01`, target: { a: '2005-01-01' }, valid: true, evaluate: true },
                        { name: 'yyyy-mm-dd hh in yyyy-mm', query: `${c.hideOperand ? '' : '{a} '}in 2005-01`, target: { a: '2005-01-01T10' }, valid: true, evaluate: true },
                        { name: 'yyyy-mm-dd hh:mm in yyyy-mm', query: `${c.hideOperand ? '' : '{a} '}in 2005-01`, target: { a: '2005-01-01T10:00' }, valid: true, evaluate: true },
                        { name: 'yyyy-mm-dd hh:mm:ss in yyyy-mm', query: `${c.hideOperand ? '' : '{a} '}in 2005-01`, target: { a: '2005-01-01 10:00:00' }, valid: true, evaluate: true },
                        { name: 'yyyy-mm-dd hh:mm:ss.xxx in yyyy-mm', query: `${c.hideOperand ? '' : '{a} '}in 2005-01`, target: { a: '2005-01-01 10:00:00.000' }, valid: true, evaluate: true },
                        { name: 'yyyy-mm-dd hh:mm:ss.xxxxxxxxx in yyyy-mm', query: `${c.hideOperand ? '' : '{a} '}in 2005-01`, target: { a: '2005-01-01 10:00:00.000000000' }, valid: true, evaluate: true },
                        { name: 'yyyy-mm-dd hh:mm:ss.xxx in yyyy-mm-ddThh:mm:ss.xxx', query: `${c.hideOperand ? '' : '{a} '}in 2005-01-01T10:00:00.000`, target: { a: '2005-01-01 10:00:00.000' }, valid: true, evaluate: true },
                        { name: 'yyyy-mm-dd hh:mm:ss.xxx in yyyy-mm-ddThh:mm:ss.xxx000', query: `${c.hideOperand ? '' : '{a} '}in 2005-01-01T10:00:00.000000`, target: { a: '2005-01-01 10:00:00.000' }, valid: true, evaluate: false },
                        { name: 'yyyy-mm-dd hh:mm:ss.xxx in yyyy-mm-ddThh:mm:ss.xxx111', query: `${c.hideOperand ? '' : '{a} '}in 2005-01-01T10:00:00.000111`, target: { a: '2005-01-01 10:00:00.000' }, valid: true, evaluate: false }
                    ]);
                });
            });
        });
    }, [
            { name: 'Query Syntax Tree', syntaxer: getQuerySyntaxTree },
            { name: 'Multi Columns Syntax Tree', syntaxer: getMultiColumnSyntaxTree },
            { name: 'Single Column Syntax Tree', syntaxer: getSingleColumnSyntaxTree, hideOperand: true }
        ]
    );
});