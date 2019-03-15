import Logger from 'core/Logger';
import { LexemeType, IUnboundedLexeme } from 'core/syntax-tree/lexicon';

const isPrime = (c: number) => {
    if (c === 2) { return true; }
    if (c < 2 || c % 2 === 0) { return false; }
    for (let n = 3; n * n <= c; n += 2) { if (c % n === 0) { return false; } }
    return true;
};

const unaryOperator: IUnboundedLexeme = {
    evaluate: (target, tree) => {
        Logger.trace('evaluate -> unary', target, tree);

        const t = tree as any;
        const opValue = t.left.lexeme.resolve(target, t.left);

        switch (tree.value.toLowerCase()) {
            case 'is even':
                return typeof opValue === 'number' && opValue % 2 === 0;
            case 'is nil':
                return opValue === undefined || opValue === null;
            case 'is bool':
                return typeof opValue === 'boolean';
            case 'is odd':
                return typeof opValue === 'number' && opValue % 2 === 1;
            case 'is num':
                return typeof opValue === 'number';
            case 'is object':
                return opValue !== null && typeof opValue === 'object';
            case 'is str':
                return typeof opValue === 'string';
            case 'is prime':
                return typeof opValue === 'number' && isPrime(opValue);
            default:
                throw new Error();
        }
    },
    name: LexemeType.UnaryOperator,
    priority: 0,
    regexp: /^((is nil)|(is odd)|(is even)|(is bool)|(is num)|(is object)|(is str)|(is prime))/i,
    syntaxer: (lexs: any[]) => {
        let [left, lexeme] = lexs;

        return Object.assign({ left }, lexeme);
    }
};

export default unaryOperator;