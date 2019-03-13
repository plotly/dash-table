import { LexemeType, ILexeme } from 'core/syntax-tree/lexicon';
import { ISyntaxTree } from 'core/syntax-tree/syntaxer';

const operand: ILexeme = {
    resolve: (target: any, tree: ISyntaxTree) => {
        if (/^(('([^'\\]|\\.)+')|("([^"\\]|\\.")+")|(`([^`\\]|\\.)+`))$/.test(tree.value)) {
            return target[
                tree.value.slice(1, tree.value.length - 1)
            ];
        } else if (/^(\w|[:.\-+])+$/.test(tree.value)) {
            return target[tree.value];
        }
    },
    regexp: /^(('([^'\\]|\\.)+')|("([^"\\]|\\.)+")|(`([^`\\]|\\.)+`)|(\w|[:.\-+])+)/,
    name: LexemeType.Operand
};

export default operand;