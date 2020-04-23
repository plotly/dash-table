import * as R from 'ramda';

import { ILexemeResult } from 'core/syntax-tree/lexer';
import { LexemeType } from 'core/syntax-tree/lexicon';

const nestingReducer = R.reduce<ILexemeResult, number>(
    (nesting, l) => nesting + (l.lexeme.nesting || 0)
);

const isNestingTransform = (lexemes: ILexemeResult[]) => {
    let nesting = 0;
    for (let i = lexemes.length - 1; i >= 0; --i) {
        const l = lexemes[i];
        nesting += (l.lexeme.nesting || 0);

        if (nesting === 0) {
            return lexemes[i].lexeme.type === LexemeType.Transformation;
        }
    }

    return false;
}

export const isTerminal = (lexemes: ILexemeResult[], _: ILexemeResult | undefined) =>
    nestingReducer(0, lexemes) === 0;

export const isTerminalExpression = (lexemes: ILexemeResult[], previous: ILexemeResult | undefined) =>
    isTerminal(lexemes, previous) &&
    !!previous &&
    R.includes(previous.lexeme.type, [
        LexemeType.RelationalOperator
    ]);

export const ifBlockClose = (lexemes: ILexemeResult[], previous: ILexemeResult | undefined) =>
    !!previous && R.includes(
        previous.lexeme.type,
        [
            LexemeType.BlockClose,
            LexemeType.BlockOpen,
            LexemeType.Expression,
            LexemeType.UnaryOperator
        ]
    ) && nestingReducer(0, lexemes) > 0;

export const ifBlockOpen = (_: ILexemeResult[], previous: ILexemeResult | undefined) =>
    !previous || R.includes(
        previous.lexeme.type,
        [
            LexemeType.BlockOpen,
            LexemeType.LogicalOperator,
            LexemeType.Transformation,
            LexemeType.UnaryOperator
        ]
    );

export const ifExpression = (_: ILexemeResult[], previous: ILexemeResult | undefined) => {
    return !previous || R.includes(
        previous.lexeme.type,
        [
            LexemeType.BlockOpen,
            LexemeType.LogicalOperator,
            LexemeType.RelationalOperator,
            LexemeType.Transformation
        ]
    );
};

export const ifTransformation = ifExpression;

export const ifLeading = (_lexs: ILexemeResult[], previous: ILexemeResult | undefined) =>
    !previous;

export const ifLogicalOperator = (_: ILexemeResult[], previous: ILexemeResult | undefined) =>
    !!previous && R.includes(
        previous.lexeme.type,
        [
            LexemeType.BlockClose,
            LexemeType.Expression,
            LexemeType.UnaryOperator
        ]
    );

export const ifRelationalOperator = (_: ILexemeResult[], previous: ILexemeResult | undefined) =>
    !!previous && R.includes(
        previous.lexeme.type,
        [
            LexemeType.Expression
        ]
    );

export const ifTransformRelationalOperator = (lexemes: ILexemeResult[], previous: ILexemeResult | undefined) => {
    const res = !!previous && R.includes(
        previous.lexeme.type,
        [
            (
                previous.lexeme.type === LexemeType.BlockClose &&
                isNestingTransform(lexemes)
            ) ? LexemeType.BlockClose : null
        ]
    );

    return res;
}

export const ifUnaryOperator = ifRelationalOperator;
