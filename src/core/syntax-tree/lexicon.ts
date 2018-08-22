import { ISyntaxTree } from 'core/syntax-tree/syntaxer';
import Logger from 'core/Logger';

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
                block : lexs.slice(1, lexs.length - 1)
            }, lexs[0]);
        }
    },
    {
        resolve: (target, tree) => {
            Logger.debug('resolve -> op', target, tree);

            return target[tree.value];
        },
        name: 'operand',
        regexp: /^[^\(\)\'\"\s]+|'[^\(\)\'\"]+'|"[^\(\)\'\"]+"/
    },
    {
        evaluate: (target, tree) => {
            Logger.debug('evaluate -> binary', target, tree);

            const t = tree as any;

            const opValue = t.left.lexeme.resolve(target, t.left);
            const expValue = t.right.lexeme.resolve(target, t.right);

            switch (tree.value.toLowerCase()) {
                case 'eq':
                case '=':
                    return opValue === expValue;
                default:
                    throw new Error();
            }
        },
        name: 'binary-operator',
        priority: 0,
        regexp: /^=|eq/i,
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
            const opValue = t.left.lexeme.resolve(target, t.left);

            switch (tree.value.toLowerCase()) {
                case 'is nil':
                    return opValue === undefined || opValue === null;
                case 'is not nil':
                    return opValue !== undefined && opValue !== null;
                default:
                    throw new Error();
            }
        },
        name: 'unary-operator',
        priority: 0,
        regexp: /^(is nil)|(is not nil)/i,
        syntaxer: (lexs: any[]) => {
            let [block, lexeme] = lexs;

            return Object.assign({ block }, lexeme);
        },
        when: ['operand']
    },
    {
        resolve: (target, tree) => {
            Logger.debug('resolve -> exp', target, tree);

            if (/^('.*')|(".*")$/.test(tree.value)) {
                return tree.value.slice(1, tree.value.length - 1);
            } else {
                return target[tree.value];
            }
        },
        name: 'expression',
        regexp: /^[^\(\)\s]+|'([^\(\)\"]|\\')+'|"([^\(\)]|\\")+"/,
        when: ['binary-operator']
    }
];

export default lexicon;