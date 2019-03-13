import {
    binaryOperator,
    expression,
    unaryOperator
} from '../lexeme';
import { LexemeType, ILexeme } from 'core/syntax-tree/lexicon';
import { ILexemeResult } from 'core/syntax-tree/lexer';

const lexicon: ILexeme[] = [
    {
        ...binaryOperator,
        terminal: false,
        if: (_lexs: ILexemeResult[], previous: ILexemeResult) => !previous
    },
    {
        ...unaryOperator,
        if: (_lexs: ILexemeResult[], previous: ILexemeResult) => !previous,
        terminal: true
    },
    {
        ...expression,
        if: (_lexs: ILexemeResult[], previous: ILexemeResult) =>
            !previous ||
            previous.lexeme.name === LexemeType.BinaryOperator,
        terminal: true
    }
];

export default lexicon;