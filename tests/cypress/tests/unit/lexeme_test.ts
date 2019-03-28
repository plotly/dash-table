import expression from 'dash-table/syntax-tree/lexeme/expression';
import operand from 'dash-table/syntax-tree/lexeme/operand';
import { ISyntaxTree } from 'core/syntax-tree/syntaxer';

describe('expression', () => {
    it('resolves values', () => {
        expect(!!expression.resolve).to.equal(true);
        expect(typeof expression.resolve).to.equal('function');

        if (expression.resolve) {
            expect(expression.resolve(undefined, { value: 'abc' } as ISyntaxTree)).to.equal('abc');
            expect(expression.resolve(undefined, { value: 'a\\ bc' } as ISyntaxTree)).to.equal('a bc');
            expect(expression.resolve(undefined, { value: '\\' } as ISyntaxTree)).to.equal('\\');
            expect(expression.resolve(undefined, { value: 'abc\\' } as ISyntaxTree)).to.equal('abc\\');
            expect(expression.resolve(undefined, { value: '\'abc\'' } as ISyntaxTree)).to.equal('abc');
            expect(expression.resolve(undefined, { value: '"abc"' } as ISyntaxTree)).to.equal('abc');
            expect(expression.resolve(undefined, { value: '`abc`' } as ISyntaxTree)).to.equal('abc');
            expect(expression.resolve(undefined, { value: '123' } as ISyntaxTree)).to.equal(123);
            expect(expression.resolve(undefined, { value: '123.45' } as ISyntaxTree)).to.equal(123.45);
            expect(expression.resolve(undefined, { value: '1E6' } as ISyntaxTree)).to.equal(1000000);
            expect(expression.resolve(undefined, { value: '0x100' } as ISyntaxTree)).to.equal(256);

            expect(expression.resolve(undefined, { value: '"\\""' } as ISyntaxTree)).to.equal('"');
            expect(expression.resolve(undefined, { value: `'\\''` } as ISyntaxTree)).to.equal(`'`);
            expect(expression.resolve(undefined, { value: '`\\``' } as ISyntaxTree)).to.equal('`');

            expect(expression.resolve({ abc: 3 }, { value: '{abc}' } as ISyntaxTree)).to.equal(3);
            expect(expression.resolve({ ['a bc']: 3 }, { value: '{a bc}' } as ISyntaxTree)).to.equal(3);
            expect(expression.resolve({ ['{abc}']: 3 }, { value: '{\\{abc\\}}' } as ISyntaxTree)).to.equal(3);
            expect(expression.resolve({ ['"abc"']: 3 }, { value: '{"abc"}' } as ISyntaxTree)).to.equal(3);

            expect(expression.resolve.bind(undefined, undefined, { value: '"' } as ISyntaxTree)).to.throw(Error);
            expect(expression.resolve.bind(undefined, undefined, { value: '`' } as ISyntaxTree)).to.throw(Error);
            expect(expression.resolve.bind(undefined, undefined, { value: `'` } as ISyntaxTree)).to.throw(Error);
            expect(expression.resolve.bind(undefined, undefined, { value: '{' } as ISyntaxTree)).to.throw(Error);
            expect(expression.resolve.bind(undefined, undefined, { value: '}' } as ISyntaxTree)).to.throw(Error);
        }
    });
});

describe('operand', () => {
    it('resolves values', () => {
        expect(!!operand.resolve).to.equal(true);
        expect(typeof operand.resolve).to.equal('function');

        if (operand.resolve) {
            expect(operand.resolve.bind(undefined, undefined, { value: 'abc' } as ISyntaxTree)).to.throw(Error);
            expect(operand.resolve.bind(undefined, undefined, { value: '123' } as ISyntaxTree)).to.throw(Error);
            expect(operand.resolve.bind(undefined, undefined, { value: '{abc' } as ISyntaxTree)).to.throw(Error);
            expect(operand.resolve.bind(undefined, undefined, { value: 'abc}' } as ISyntaxTree)).to.throw(Error);
            expect(operand.resolve.bind(undefined, undefined, { value: '{{abc}}' } as ISyntaxTree)).to.throw(Error);

            expect(operand.resolve({ abc: 3 }, { value: '{abc}' } as ISyntaxTree)).to.equal(3);
            expect(operand.resolve({ ['a bc']: 3 }, { value: '{a bc}' } as ISyntaxTree)).to.equal(3);
            expect(operand.resolve({ ['{abc}']: 3 }, { value: '{\\{abc\\}}' } as ISyntaxTree)).to.equal(3);
            expect(operand.resolve({ ['"abc"']: 3 }, { value: '{"abc"}' } as ISyntaxTree)).to.equal(3);
        }
    });
});