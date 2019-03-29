import isNumeric from 'fast-isnumeric';

import { LexemeType, IUnboundedLexeme } from 'core/syntax-tree/lexicon';
import { ISyntaxTree } from 'core/syntax-tree/syntaxer';
import operand, { FIELD_REGEX } from './operand';

const STRING_REGEX = /^(('([^'\\]|\\'|\\)+')|("([^"\\]|\\"|\\)+")|(`([^`\\]|\\`|\\)+`))/;
const VALUE_REGEX = /^([^\s'"`{}()\\]|\\[\s'"`{}()]?)+/;

const expression: IUnboundedLexeme = {
    present: (tree: ISyntaxTree) => tree.value,
    resolve: (target: any, tree: ISyntaxTree) => {
        if (FIELD_REGEX.test(tree.value)) {
            return operand.resolve && operand.resolve(target, tree);
        } else if (STRING_REGEX.test(tree.value)) {
            return tree.value.slice(1, tree.value.length - 1).replace(/\\('|"|`)/g, '$1');
        } else if (VALUE_REGEX.test(tree.value)) {
            return isNumeric(tree.value) ?
                +tree.value :
                tree.value.replace(/\\([\s'"`{}()])/g, '$1');
        } else {
            throw new Error();
        }
    },
    regexp: [FIELD_REGEX, STRING_REGEX, VALUE_REGEX],
    type: LexemeType.Expression
};

export default expression;