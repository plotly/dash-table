import * as R from 'ramda';

import { ILexemeResult } from 'core/syntax-tree/lexer';
import { LexemeType } from 'core/syntax-tree/lexicon';

const nestingReducer = R.reduce<ILexemeResult, number>(
    (nesting, l) => nesting + (l.lexeme.nesting || 0)
);

export const isTerminal = (lexemes: ILexemeResult[], previous: ILexemeResult) =>
    previous && nestingReducer(0, lexemes) === 0;

export const isTerminalExpression = (lexemes: ILexemeResult[], previous: ILexemeResult) =>
    isTerminal(lexemes, previous) &&
    R.contains(previous.lexeme.type, [
        LexemeType.RelationalOperator
    ]);

export const ifBlockClose = (lexemes: ILexemeResult[], previous: ILexemeResult) =>
    previous && R.contains(
        previous.lexeme.type,
        [
            LexemeType.BlockClose,
            LexemeType.BlockOpen,
            LexemeType.Expression,
            LexemeType.UnaryOperator
        ]
    ) && nestingReducer(0, lexemes) > 0;

export const ifBlockOpen = (_: ILexemeResult[], previous: ILexemeResult) =>
    !previous || R.contains(
        previous.lexeme.type,
        [
            LexemeType.BlockOpen,
            LexemeType.LogicalOperator,
            LexemeType.UnaryOperator
        ]
    );

export const ifExpression = (_: ILexemeResult[], previous: ILexemeResult) =>
    previous && R.contains(
        previous.lexeme.type,
        [
            LexemeType.BlockOpen,
            LexemeType.LogicalOperator,
            LexemeType.RelationalOperator
        ]
    );

export const ifLeading = (_lexs: ILexemeResult[], previous: ILexemeResult) =>
    !previous;

export const ifLogicalOperator = (_: ILexemeResult[], previous: ILexemeResult) =>
    previous && R.contains(
        previous.lexeme.type,
        [
            LexemeType.BlockClose,
            LexemeType.Expression,
            LexemeType.UnaryOperator
        ]
    );

export const ifRelationalOperator = (_: ILexemeResult[], previous: ILexemeResult) =>
    previous && R.contains(
        previous.lexeme.type,
        [LexemeType.Operand]
    );

export const ifUnaryOperator = ifRelationalOperator;