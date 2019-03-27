import { LexemeType, IUnboundedLexeme } from 'core/syntax-tree/lexicon';
import { ISyntaxTree } from 'core/syntax-tree/syntaxer';

const REGEX = /^{(([^{}\\]|\\{|\\}|\\)+)}/;

const getValue = (
    value: string
) => value
    .slice(1, value.length - 1)
    .replace(/\\([{}])/g, '$1');

const operand: IUnboundedLexeme = {
    present: (tree: ISyntaxTree) => getValue(tree.value),
    resolve: (target: any, tree: ISyntaxTree) => {
        if (REGEX.test(tree.value)) {
            return target[getValue(tree.value)];
        } else {
            throw new Error();
        }
    },
    regexp: REGEX,
    type: LexemeType.Operand
};

export default operand;