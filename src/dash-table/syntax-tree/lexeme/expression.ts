import { LexemeType, IUnboundedLexeme } from 'core/syntax-tree/lexicon';
import { ISyntaxTree } from 'core/syntax-tree/syntaxer';

const expression: IUnboundedLexeme = {
    resolve: (target: any, tree: ISyntaxTree) => {
        if (/^(('([^'\\]|\\.)+')|("([^"\\]|\\.)+")|(`([^`\\]|\\.)+`))$/.test(tree.value)) {
            return tree.value.slice(1, tree.value.length - 1);
        } else if (/^(num|str)\(.*\)$/.test(tree.value)) {
            const res = tree.value.match(/^(\w+)\((.*)\)$/);
            if (res) {
                const [, op, value] = res;

                switch (op) {
                    case 'num':
                        return parseFloat(value);
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
    regexp: /^(((num|str)\([^()]*\))|('([^'\\]|\\.)+')|("([^"\\]|\\.)+")|(`([^`\\]|\\.)+`)|(\w|[:.\-+])+)/,
    type: LexemeType.Expression
};

export default expression;