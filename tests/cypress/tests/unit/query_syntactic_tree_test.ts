import { QuerySyntaxTree } from 'dash-table/syntax-tree';

describe('Query Syntax Tree', () => {
    const data0 = { a: '0', b: '0', c: 0, d: null, '\\\{': 0, 'a.dot': '0.dot', 'a-dot': '0-dot', a_dot: '0_dot', 'a+dot': '0+dot', 'a dot': '0 dot', 'a:dot': '0:dot', '_-6.:+** *@$': '0*dot', '{a:dot}': '0*dot*', '\'""\'': '0\'"dot' };
    const data1 = { a: '1', b: '0', c: 1, d: 0, '\\\{': 1, 'a.dot': '1.dot', 'a-dot': '1-dot', a_dot: '1_dot', 'a+dot': '1+dot', 'a dot': '1 dot', 'a:dot': '1:dot', '_-6.:+** *@$': '1*dot', '{a:dot}': '1*dot*', '\'""\'': '1\'"dot' };
    const data2 = { a: '2', b: '1', c: 2, d: '', '\\\{': 2, 'a.dot': '2.dot', 'a-dot': '2-dot', a_dot: '2_dot', 'a+dot': '2+dot', 'a dot': '2 dot', 'a:dot': '2:dot', '_-6.:+** *@$': '2*dot', '{a:dot}': '2*dot*', '\'""\'': '2\'"dot' };
    const data3 = { a: '3', b: '1', c: 3, d: false, '\\\{': 3, 'a.dot': '3.dot', 'a-dot': '3-dot', a_dot: '3_dot', 'a+dot': '3+dot', 'a dot': '3 dot', 'a:dot': '3:dot', '_-6.:+** *@$': '3*dot', '{a:dot}': '3*dot*', '\'""\'': '3\'"dot' };

    describe('operands', () => {
        it('does not support badly formed operands', () => {
            expect(new QuerySyntaxTree(`{myField} eq 0`).isValid).to.equal(true);
            expect(new QuerySyntaxTree(`{'myField'} eq 0`).isValid).to.equal(true);
            expect(new QuerySyntaxTree(`{"myField"} eq 0`).isValid).to.equal(true);
            expect(new QuerySyntaxTree('{`myField`} eq 0').isValid).to.equal(true);
            expect(new QuerySyntaxTree('{\\{myField\\}} eq 0').isValid).to.equal(true);
            expect(new QuerySyntaxTree('{{myField}} eq 0').isValid).to.equal(false);
            expect(new QuerySyntaxTree(`{myField eq 0`).isValid).to.equal(false);
            expect(new QuerySyntaxTree(`myField} eq 0`).isValid).to.equal(false);
            expect(new QuerySyntaxTree(`myField eq 0`).isValid).to.equal(false);
        });

        it('does not support badly formed expression', () => {
            expect(new QuerySyntaxTree(`{myField} eq 'value'`).isValid).to.equal(true);
            expect(new QuerySyntaxTree(`{myField} eq "value"`).isValid).to.equal(true);
            expect(new QuerySyntaxTree('{myField} eq `value`').isValid).to.equal(true);
            expect(new QuerySyntaxTree(`{myField} eq 'value\\'`).isValid).to.equal(false);
            expect(new QuerySyntaxTree(`{myField} eq "value\\"`).isValid).to.equal(false);
            expect(new QuerySyntaxTree(`{myField} eq \\'value'`).isValid).to.equal(false);
            expect(new QuerySyntaxTree(`{myField} eq \\"value"`).isValid).to.equal(false);
        });

        it('support arbitrary quoted column name', () => {
            const tree = new QuerySyntaxTree(`{_-6.:+** *@$} eq "1*dot" || {_-6.:+** *@$} eq "2*dot"`);

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('support column name with "."', () => {
            const tree = new QuerySyntaxTree('{a.dot} eq "1.dot" || {a.dot} eq "2.dot"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('support column name with "-"', () => {
            const tree = new QuerySyntaxTree('{a-dot} eq "1-dot" || {a-dot} eq "2-dot"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('support column name with "_"', () => {
            const tree = new QuerySyntaxTree('{a_dot} eq "1_dot" || {a_dot} eq "2_dot"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('support column name with "+"', () => {
            const tree = new QuerySyntaxTree('{a+dot} eq "1+dot" || {a+dot} eq "2+dot"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('support column name with ":"', () => {
            const tree = new QuerySyntaxTree('{a:dot} eq "1:dot" || {a:dot} eq "2:dot"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('support column name with " " (space)', () => {
            const tree = new QuerySyntaxTree('{a dot} eq "1 dot" || {a dot} eq "2 dot"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('support column name with "{}"', () => {
            const tree = new QuerySyntaxTree('{\\{a:dot\\}} eq "1*dot*" || {\\{a:dot\\}} eq "2*dot*"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('support column name with "\\"', () => {
            const tree = new QuerySyntaxTree('{\\\\{} eq 1 || {\\\\{} eq 2');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('support nesting in quotes', () => {
            const tree = new QuerySyntaxTree(`{'""'} eq '1\\'"dot' || {'""'} eq '2\\'"dot'`);

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(false);
        });
    });

    describe('&& and ||', () => {
        it('can || two conditions', () => {
            const tree = new QuerySyntaxTree('{a} eq "1" || {a} eq "2"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can "or" two conditions', () => {
            const tree = new QuerySyntaxTree('{a} eq "1" or {a} eq "2"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can && two conditions', () => {
            const tree = new QuerySyntaxTree('{a} eq "1" && {b} eq "0"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can "and" two conditions', () => {
            const tree = new QuerySyntaxTree('{a} eq "1" and {b} eq "0"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('gives priority to && over ||', () => {
            const tree = new QuerySyntaxTree('{a} eq "1" && {a} eq "0" || {b} eq "1"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(true);
        });

        it('gives priority to "and" over "or"', () => {
            const tree = new QuerySyntaxTree('{a} eq "1" and {a} eq "0" or {b} eq "1"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(true);
        });
    });

    describe('data types', () => {
        it('can compare numbers', () => {
            const tree = new QuerySyntaxTree('{c} eq 1');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can compare floats', () => {
            const tree = new QuerySyntaxTree('{field} ge 1.5');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate({ field: -1.501 })).to.equal(false);
            expect(tree.evaluate({ field: 1 })).to.equal(false);
            expect(tree.evaluate({ field: 1.499 })).to.equal(false);
            expect(tree.evaluate({ field: 1.5 })).to.equal(true);
            expect(tree.evaluate({ field: 1.501 })).to.equal(true);
            expect(tree.evaluate({ field: 2 })).to.equal(true);
        });

        it('can compare string to number and return false', () => {
            const tree = new QuerySyntaxTree('{a} eq 1');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can compare strings', () => {
            const tree = new QuerySyntaxTree('{a} eq "1"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can compare string to number and return false', () => {
            const tree = new QuerySyntaxTree('{c} eq "1"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });
    });

    describe('block', () => {
        it('has priority over && and ||', () => {
            const tree = new QuerySyntaxTree('{a} eq "1" && ({a} eq "0" || {b} eq "1")');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('gives priority over "and" and "or"', () => {
            const tree = new QuerySyntaxTree('{a} eq "1" and ({a} eq "0" or {b} eq "1")');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can be uselessly nested', () => {
            const tree = new QuerySyntaxTree('(({a} eq "1" and ((({a} eq "0" or {b} eq "1")))))');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can be nested', () => {
            const tree = new QuerySyntaxTree('{a} eq "1" and ({a} eq "0" or ({b} eq "1" or {b} eq "0"))');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });
    });

    describe('unary operators', () => {
        it('can check nil', () => {
            const tree = new QuerySyntaxTree('{d} is nil');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(true);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can invert check nil', () => {
            const tree = new QuerySyntaxTree('!({d} is nil)');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(true);
        });

        it('can check odd', () => {
            const tree = new QuerySyntaxTree('{c} is odd');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(true);
        });

        it('can check odd on string and return false', () => {
            const tree = new QuerySyntaxTree('{a} is odd');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can check even', () => {
            const tree = new QuerySyntaxTree('{c} is even');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(true);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can check even on string and return false', () => {
            const tree = new QuerySyntaxTree('{a} is even');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can check if string', () => {
            const tree = new QuerySyntaxTree('{d} is str');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can check if number', () => {
            const tree = new QuerySyntaxTree('{d} is num');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can check if bool', () => {
            const tree = new QuerySyntaxTree('{d} is bool');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(true);
        });

        it('can check if object', () => {
            const tree = new QuerySyntaxTree('{d} is object');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });
    });

    describe('unary not', () => {
        it('can invert block', () => {
            const tree = new QuerySyntaxTree('!({a} eq "1")');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(true);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(true);
        });

        it('can invert block multiple times', () => {
            const tree = new QuerySyntaxTree('!!({a} eq "1")');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });
    });

    describe('logical binary operators', () => {
        it('can do equality (eq) test', () => {
            const tree = new QuerySyntaxTree('{a} eq "1"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can do equality (=) test', () => {
            const tree = new QuerySyntaxTree('{a} = "1"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can do difference (ne) test', () => {
            const tree = new QuerySyntaxTree('{a} ne "1"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(true);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(true);
        });

        it('can do difference (!=) test', () => {
            const tree = new QuerySyntaxTree('{a} != "1"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(true);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(true);
        });

        it('can do greater than (gt) test', () => {
            const tree = new QuerySyntaxTree('{a} gt "1"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(true);
        });

        it('can do greater than (>) test', () => {
            const tree = new QuerySyntaxTree('{a} > "1"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(true);
        });

        it('can do less than (lt) test', () => {
            const tree = new QuerySyntaxTree('{a} lt "1"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(true);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can do less than (<) test', () => {
            const tree = new QuerySyntaxTree('{a} < "1"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(true);
            expect(tree.evaluate(data1)).to.equal(false);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can do greater or equal to (ge) test', () => {
            const tree = new QuerySyntaxTree('{a} ge "1"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(true);
        });

        it('can do greater or equal to (>=) test', () => {
            const tree = new QuerySyntaxTree('{a} >= "1"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(false);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(true);
            expect(tree.evaluate(data3)).to.equal(true);
        });

        it('can do less or equal to (le) test', () => {
            const tree = new QuerySyntaxTree('{a} le "1"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(true);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });

        it('can do less or equal to (<=) test', () => {
            const tree = new QuerySyntaxTree('{a} <= "1"');

            expect(tree.isValid).to.equal(true);
            expect(tree.evaluate(data0)).to.equal(true);
            expect(tree.evaluate(data1)).to.equal(true);
            expect(tree.evaluate(data2)).to.equal(false);
            expect(tree.evaluate(data3)).to.equal(false);
        });
    });
});