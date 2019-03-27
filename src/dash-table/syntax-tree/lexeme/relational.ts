import * as R from 'ramda';

import Logger from 'core/Logger';
import { LexemeType, IUnboundedLexeme } from 'core/syntax-tree/lexicon';
import { ISyntaxTree } from 'core/syntax-tree/syntaxer';

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

const LEXEME_BASE = {
    priority: 0,
    syntaxer: relationalSyntaxer,
    type: LexemeType.RelationalOperator
};

export const equal: IUnboundedLexeme = R.merge({
    evaluate: relationalEvaluator(([op, exp]) => op === exp),
    regexp: /^(=|eq)/i
}, LEXEME_BASE);

export const greaterOrEqual: IUnboundedLexeme = R.merge({
    evaluate: relationalEvaluator(([op, exp]) => op >= exp),
    regexp: /^(>=|ge)/i
}, LEXEME_BASE);

export const greaterThan: IUnboundedLexeme = R.merge({
    evaluate: relationalEvaluator(([op, exp]) => op > exp),
    regexp: /^(>|gt)/i
}, LEXEME_BASE);

export const lessOrEqual: IUnboundedLexeme = R.merge({
    evaluate: relationalEvaluator(([op, exp]) => op <= exp),
    regexp: /^(<=|le)/i
}, LEXEME_BASE);

export const lessThan: IUnboundedLexeme = R.merge({
    evaluate: relationalEvaluator(([op, exp]) => op < exp),
    regexp: /^(<|lt)/i
}, LEXEME_BASE);

export const notEqual: IUnboundedLexeme = R.merge({
    evaluate: relationalEvaluator(([op, exp]) => op !== exp),
    regexp: /^(!=|ne)/i
}, LEXEME_BASE);