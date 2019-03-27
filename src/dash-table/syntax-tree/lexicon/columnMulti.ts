import * as R from 'ramda';

import {
    and,
    operand,
    equal,
    greaterOrEqual,
    greaterThan,
    lessOrEqual,
    lessThan,
    notEqual,
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
    ...[equal, greaterOrEqual, greaterThan, lessOrEqual, lessThan, notEqual].map(op => ({
        ...op,
        if: (_: ILexemeResult[], previous: ILexemeResult) =>
            previous && R.contains(
                previous.lexeme.name,
                [LexemeType.Operand]
            ),
        terminal: false
    })),
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
                [LexemeType.RelationalOperator]
            ),
        terminal: true
    }
];

export default lexicon;