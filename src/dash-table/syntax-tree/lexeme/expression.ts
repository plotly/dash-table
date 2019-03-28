import isNumeric from 'fast-isnumeric';

import { LexemeType, IUnboundedLexeme } from 'core/syntax-tree/lexicon';
import { ISyntaxTree } from 'core/syntax-tree/syntaxer';

const REGEX = /^(({(([^{}\\]|\\{|\\}|\\)+)})|('([^'\\]|\\.)+')|("([^"\\]|\\.)+")|([^\s'"]+))/;

const FIELD_REGEX = /^{(([^{}\\]|\\{|\\}|\\)+)}/;
const STRING_REGEX = /^(('([^'\\]|\\')+')|("([^"\\]|\\")+"))/;
const DIGITS_REGEX = /^[^\s'"]+/;

const expression: IUnboundedLexeme = {
    present: (tree: ISyntaxTree) => tree.value,
    resolve: (target: any, tree: ISyntaxTree) => {
        if (FIELD_REGEX.test(tree.value)) {
            return target[tree.value.slice(1, tree.value.length - 1)];
        } else if (STRING_REGEX.test(tree.value)) {
            return tree.value.slice(1, tree.value.length - 1).replace(/\\('|")/g, '$1');
        } else if (DIGITS_REGEX.test(tree.value)) {
            return isNumeric(tree.value) ?
                +tree.value :
                tree.value;
        } else {
            throw new Error();
        }
    },
    regexp: REGEX,
    type: LexemeType.Expression
};

export default expression;