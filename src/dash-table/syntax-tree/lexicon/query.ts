import * as R from 'ramda';

import {
    and,
    binaryOperator,
    blockClose,
    blockOpen,
    expression,
    operand,
    or,
    unaryNot,
    unaryOperator
} from '../lexeme';
import { ILexemeResult } from 'core/syntax-tree/lexer';
import { LexemeType, ILexeme } from 'core/syntax-tree/lexicon';

const nestingReducer = R.reduce<ILexemeResult, number>(
    (nesting, l) => nesting + (l.lexeme.nesting || 0)
);

const isTerminal = (lexemes: ILexemeResult[], previous: ILexemeResult) =>
    previous && nestingReducer(0, lexemes) === 0;

const ifExpression = (_: ILexemeResult[], previous: ILexemeResult) =>
    previous && R.contains(
        previous.lexeme.name,
        [LexemeType.BinaryOperator]
    );

const ifLogicalOperator = (_: ILexemeResult[], previous: ILexemeResult) =>
    previous && R.contains(
        previous.lexeme.name,
        [
            LexemeType.BlockClose,
            LexemeType.Expression,
            LexemeType.UnaryOperator
        ]
    );

const ifOperator = (_: ILexemeResult[], previous: ILexemeResult) =>
    previous && R.contains(
        previous.lexeme.name,
        [LexemeType.Operand]
    );

const lexicon: ILexeme[] = [
    {
        ...and,
        if: ifLogicalOperator,
        terminal: false
    },
    {
        ...or,
        if: ifLogicalOperator,
        terminal: false
    },
    {
        ...blockClose,
        if: (lexemes: ILexemeResult[], previous: ILexemeResult) =>
            previous && R.contains(
                previous.lexeme.name,
                [
                    LexemeType.BlockClose,
                    LexemeType.BlockOpen,
                    LexemeType.Expression,
                    LexemeType.UnaryOperator
                ]
            ) && nestingReducer(0, lexemes) > 0,
        terminal: isTerminal
    },
    {
        ...blockOpen,
        if: (_: ILexemeResult[], previous: ILexemeResult) =>
            !previous || R.contains(
                previous.lexeme.name,
                [
                    LexemeType.And,
                    LexemeType.BlockOpen,
                    LexemeType.Or,
                    LexemeType.UnaryNot
                ]
            ),
        terminal: false
    },
    {
        ...operand,
        if: (_: ILexemeResult[], previous: ILexemeResult) =>
            !previous || R.contains(
                previous.lexeme.name,
                [
                    LexemeType.And,
                    LexemeType.BlockOpen,
                    LexemeType.Or
                ]
            ),
        terminal: false
    },
    {
        ...binaryOperator,
        if: ifOperator,
        terminal: false
    },
    {
        ...unaryOperator,
        if: ifOperator,
        terminal: isTerminal
    },
    {
        ...unaryNot,
        if: (_: ILexemeResult[], previous: ILexemeResult) =>
            !previous || R.contains(
                previous.lexeme.name,
                [
                    LexemeType.And,
                    LexemeType.Or,
                    LexemeType.UnaryNot
                ]
            ),
        terminal: false
    },
    {
        ...expression,
        if: ifExpression,
        terminal: isTerminal
    }
];

export default lexicon;