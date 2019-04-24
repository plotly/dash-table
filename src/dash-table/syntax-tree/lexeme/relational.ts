import isNumeric from 'fast-isnumeric';
import * as R from 'ramda';

import Logger from 'core/Logger';
import { LexemeType, IUnboundedLexeme } from 'core/syntax-tree/lexicon';
import { ISyntaxTree } from 'core/syntax-tree/syntaxer';
import { normalizeDate } from 'dash-table/type/date';

function evaluator(
    target: any,
    tree: ISyntaxTree
): [any, any] {
    Logger.trace('evaluate -> relational', target, tree);

    const t = tree as any;

    const opValue = t.left.lexeme.resolve(target, t.left);
    const expValue = t.right.lexeme.resolve(target, t.right);
    Logger.trace(`opValue: ${opValue}, expValue: ${expValue}`);

    return [opValue, expValue];
}

function relationalSyntaxer([left, lexeme, right]: any[]) {
    return Object.assign({ left, right }, lexeme);
}

function relationalEvaluator(
    fn: ([opValue, expValue]: any[]) => boolean
) {
    return (target: any, tree: ISyntaxTree) => fn(evaluator(target, tree));
}

export enum RelationalOperator {
    Contains = 'contains',
    Equal = '=',
    GreaterOrEqual = '>=',
    GreaterThan = '>',
    LessOrEqual = '<=',
    LessThan = '<',
    LikeDate = 'like_date',
    NotEqual = '!='
}

const LEXEME_BASE = {
    priority: 0,
    syntaxer: relationalSyntaxer,
    type: LexemeType.RelationalOperator
};

export const contains: IUnboundedLexeme = R.merge({
    evaluate: relationalEvaluator(([op, exp]) =>
        !R.isNil(op) &&
        !R.isNil(exp) &&
        R.type(op.toString) === 'Function' &&
        R.type(exp.toString) === 'Function' &&
        op.toString().indexOf(exp.toString()) !== -1
    ),
    subType: RelationalOperator.Contains,
    regexp: /^(contains)/i
}, LEXEME_BASE);

export const equal: IUnboundedLexeme = R.merge({
    evaluate: relationalEvaluator(([op, exp]) => (
        isNumeric(op) &&
        isNumeric(exp) &&
        +op === +exp
    ) || op === exp),
    subType: RelationalOperator.Equal,
    regexp: /^(=|eq)/i
}, LEXEME_BASE);

export const greaterOrEqual: IUnboundedLexeme = R.merge({
    evaluate: relationalEvaluator(([op, exp]) => op >= exp),
    subType: RelationalOperator.GreaterOrEqual,
    regexp: /^(>=|ge)/i
}, LEXEME_BASE);

export const greaterThan: IUnboundedLexeme = R.merge({
    evaluate: relationalEvaluator(([op, exp]) => op > exp),
    subType: RelationalOperator.GreaterThan,
    regexp: /^(>|gt)/i
}, LEXEME_BASE);

export const likeDate: IUnboundedLexeme = R.merge({
    evaluate: relationalEvaluator(([op, exp]) => {
        const normalizedOp = normalizeDate(op);
        const normalizedExp = normalizeDate(exp);

        return !R.isNil(normalizedOp) &&
            !R.isNil(normalizedExp) &&
            // IE11 does not support `startsWith`
            normalizedOp.indexOf(normalizedExp) === 0;
    }),
    subType: RelationalOperator.LikeDate,
    regexp: /^(in)/i
}, LEXEME_BASE);

export const lessOrEqual: IUnboundedLexeme = R.merge({
    evaluate: relationalEvaluator(([op, exp]) => op <= exp),
    subType: RelationalOperator.LessOrEqual,
    regexp: /^(<=|le)/i
}, LEXEME_BASE);

export const lessThan: IUnboundedLexeme = R.merge({
    evaluate: relationalEvaluator(([op, exp]) => op < exp),
    subType: RelationalOperator.LessThan,
    regexp: /^(<|lt)/i
}, LEXEME_BASE);

export const notEqual: IUnboundedLexeme = R.merge({
    evaluate: relationalEvaluator(([op, exp]) => op !== exp),
    subType: RelationalOperator.NotEqual,
    regexp: /^(!=|ne)/i
}, LEXEME_BASE);