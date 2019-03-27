import { LexemeType, IUnboundedLexeme } from 'core/syntax-tree/lexicon';
import { ISyntaxTree } from 'core/syntax-tree/syntaxer';

const REGEX = /^{(([^{}\\]|\\{|\\}|\\)+)}/;

const operand: IUnboundedLexeme = {
    resolve: (target: any, tree: ISyntaxTree) => {
        if (REGEX.test(tree.value)) {
            return target[
                tree.value.slice(1, tree.value.length - 1).replace(/\\([{}])/g, '$1')
            ];
        } else {
            throw new Error();
        }
    },
    regexp: REGEX,
    type: LexemeType.Operand
};

export default operand;