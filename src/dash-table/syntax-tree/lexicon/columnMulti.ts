import * as R from 'ramda';

import {
    and,
    operand,
    binaryOperator,
    unaryOperator,
    expression
} from '../lexeme';
import { ILexeme, LexemeType } from 'core/syntax-tree/lexicon';
import { ILexemeResult } from 'core/syntax-tree/lexer';

const lexicon: ILexeme[] = [
    {
        ...and,
        if: (_: ILexemeResult[], previous: ILexemeResult) =>
            previous && R.contains(
                previous.lexeme.name,
                [
                    LexemeType.Expression,
                    LexemeType.UnaryOperator
                ]
            ),
        terminal: false
    },
    {
        ...operand,
        if: (_: ILexemeResult[], previous: ILexemeResult) =>
            !previous || R.contains(
                previous.lexeme.name,
                [LexemeType.And]
            ),
        terminal: false
    },
    {
        ...binaryOperator,
        if: (_: ILexemeResult[], previous: ILexemeResult) =>
            previous && R.contains(
                previous.lexeme.name,
                [LexemeType.Operand]
            ),
        terminal: false
    },
    {
        ...unaryOperator,
        if: (_: ILexemeResult[], previous: ILexemeResult) =>
            previous && R.contains(
                previous.lexeme.name,
                [LexemeType.Operand]
            ),
        terminal: true
    },
    {
        ...expression,
        if: (_: ILexemeResult[], previous: ILexemeResult) =>
            previous && R.contains(
                previous.lexeme.name,
                [LexemeType.BinaryOperator]
            ),
        terminal: true
    }
];

export default lexicon;