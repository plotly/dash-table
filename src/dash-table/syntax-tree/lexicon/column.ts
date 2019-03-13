import {
    binaryOperator,
    expression,
    unaryOperator
} from '../lexeme';
import { LexemeType } from 'core/syntax-tree/lexicon';

export default {
    allowFreeForm: false,
    lexemes: [
        { ...binaryOperator, when: [undefined], terminal: false },
        { ...unaryOperator, when: [undefined] },
        { ...expression, when: [undefined, LexemeType.BinaryOperator] }
    ]
};