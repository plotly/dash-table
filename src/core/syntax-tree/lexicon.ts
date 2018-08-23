import Logger from 'core/Logger';
import { ISyntaxTree } from 'core/syntax-tree/syntaxer';

export interface ILexeme {
    evaluate?: (target: any, tree: ISyntaxTree) => boolean;
    resolve?: (target: any, tree: ISyntaxTree) => any;
    name: string;
    nesting?: number;
    priority?: number;
    regexp: RegExp;
    syntaxer?: (lexs: any[], pivot: any, pivotIndex: number) => any;
    when?: string[];
}

const isPrime = (c: number) => {
    if (c < 2) { return false; }
    for (let n = 2; n * n <= c; ++n) { if (c !== n && c % n === 0) { return false; } }
    return true;
};

const baseOperand = {
    resolve: (target: any, tree: ISyntaxTree) => {
        Logger.debug('resolve -> exp', target, tree);

        if (/^('.*')|(".*")$/.test(tree.value)) {
            return tree.value.slice(1, tree.value.length - 1);
        } else if (/^\w+\(.*\)$/.test(tree.value)) {
            const res = tree.value.match(/^(\w+)\((.*)\)$/);
            if (res) {
                const [, op, value] = res;

                switch (op) {
                    case 'num':
                        return parseInt(value, 10);
                    case 'str':
                    default:
                        return value;
                }
            } else {
                throw Error();
            }
        } else {
            return target[tree.value];
        }
    },
    regexp: /^((num|str)\([^()]*\))|[^\(\)\s]+|'([^()']|\\')+'|"([^()"]|\\")+/
};

const lexicon: ILexeme[] = [
    {
        evaluate: (target, tree) => {
            Logger.debug('evalute -> &&', target, tree);

            const t = tree as any;
            const lv = t.left.lexeme.evaluate(target, t.left);
            const rv = t.right.lexeme.evaluate(target, t.right);
            return lv && rv;
        },
        name: 'and',
        priority: 2,
        regexp: /^(and\s|&&)/i,
        syntaxer: (lexs: any[], pivot: any, pivotIndex: number) => {
            return Object.assign({
                left: lexs.slice(0, pivotIndex),
                right: lexs.slice(pivotIndex + 1)
            }, pivot);
        }
    },
    {
        evaluate: (target, tree) => {
            Logger.debug('evalute -> ||', target, tree);

            const t = tree as any;

            return t.left.lexeme.evaluate(target, t.left) ||
                t.right.lexeme.evaluate(target, t.right);
        },
        name: 'or',
        priority: 3,
        regexp: /^(or\s|\|\|)/i,
        syntaxer: (lexs: any[], pivot: any, pivotIndex: number) => {
            return Object.assign({
                left: lexs.slice(0, pivotIndex),
                right: lexs.slice(pivotIndex + 1)
            }, pivot);
        }
    },
    {
        name: 'close-block',
        nesting: -1,
        regexp: /^\)/
    },
    {
        evaluate: (target, tree) => {
            Logger.debug('evaluate -> ()', target, tree);

            const t = tree as any;

            return t.block.lexeme.evaluate(target, t.block);
        },
        name: 'open-block',
        nesting: 1,
        priority: 1,
        regexp: /^\(/,
        syntaxer: (lexs: any[]) => {
            return Object.assign({
                block: lexs.slice(1, lexs.length - 1)
            }, lexs[0]);
        }
    },
    Object.assign({}, baseOperand, {
        name: 'operand'
    }),
    {
        evaluate: (target, tree) => {
            Logger.debug('evaluate -> binary', target, tree);

            const t = tree as any;

            const opValue = t.left.lexeme.resolve(target, t.left);
            const expValue = t.right.lexeme.resolve(target, t.right);
            Logger.debug(`opValue: ${opValue}, expValue: ${expValue}`);

            switch (tree.value.toLowerCase()) {
                case 'eq':
                case '=':
                    return opValue === expValue;
                case 'gt':
                case '>':
                    return opValue > expValue;
                case 'ge':
                case '>=':
                    return opValue >= expValue;
                case 'lt':
                case '<':
                    return opValue < expValue;
                case 'le':
                case '<=':
                    return opValue <= expValue;
                case 'ne':
                case '!=':
                    return opValue !== expValue;
                default:
                    throw new Error();
            }
        },
        name: 'logical-binary-operator',
        priority: 0,
        regexp: /^eq|=|gt|>|ge|>=|lt|<|le|<=|ne|!=/i,
        // regexp: /=|!=|>=|<=|eq|lt|gt|le|ge|ne/i,
        syntaxer: (lexs: any[]) => {
            let [left, lexeme, right] = lexs;

            return Object.assign({ left, right }, lexeme);
        },
        when: ['operand']
    },
    {
        evaluate: (target, tree) => {
            Logger.debug('evaluate -> unary', target, tree);

            const t = tree as any;
            const opValue = t.block.lexeme.resolve(target, t.block);

            switch (tree.value.toLowerCase()) {
                case 'is even':
                    return typeof opValue === 'number' && opValue % 2 === 0;
                case 'is nil':
                    return opValue === undefined || opValue === null;
                case 'is not nil':
                    return opValue !== undefined && opValue !== null;
                case 'is odd':
                    return typeof opValue === 'number' && opValue % 2 === 1;
                case 'is prime':
                    return typeof opValue === 'number' && isPrime(opValue);
                case 'is not prime':
                    return typeof opValue !== 'number' || !isPrime(opValue);
                default:
                    throw new Error();
            }
        },
        name: 'logical-unary-operator',
        priority: 0,
        regexp: /^(is nil)|(is not nil)|(is odd)|(is even)|(is prime)|(is not prime)/i,
        syntaxer: (lexs: any[]) => {
            let [block, lexeme] = lexs;

            return Object.assign({ block }, lexeme);
        },
        when: ['operand']
    },
    Object.assign({}, baseOperand, {
        name: 'expression',
        when: ['logical-binary-operator']
    })
];

export default lexicon;