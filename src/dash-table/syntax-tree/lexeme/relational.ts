import isNumeric from 'fast-isnumeric';
import * as R from 'ramda';

import Logger from 'core/Logger';
import { LexemeType, IUnboundedLexeme } from 'core/syntax-tree/lexicon';
import { ISyntaxTree } from 'core/syntax-tree/syntaxer';
import { normalizeDate } from 'dash-table/type/date';
import { IDateValidation } from 'dash-table/components/Table/props';

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
    DateStartsWith = 'datestartswith',
    Equal = '=',
    GreaterOrEqual = '>=',
    GreaterThan = '>',
    LessOrEqual = '<=',
    LessThan = '<',
    NotEqual = '!=',
    IContains = 'icontains',
    IEqual = 'i=',
    IGreaterOrEqual = 'i>=',
    IGreaterThan = 'i>',
    ILessOrEqual = 'i<=',
    ILessThan = 'i<',
    INotEqual = 'i!=',
    SContains = 'scontains',
    SEqual = 's=',
    SGreaterOrEqual = 's>=',
    SGreaterThan = 's>',
    SLessOrEqual = 's<=',
    SLessThan = 's<',
    SNotEqual = 's!='
}

const LEXEME_BASE = {
    priority: 0,
    syntaxer: relationalSyntaxer,
    type: LexemeType.RelationalOperator
};

export const contains: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) =>
        !R.isNil(exp) &&
        !R.isNil(op) &&
        (R.type(exp) === 'String' || R.type(op) === 'String') &&
        op.toString().indexOf(exp.toString()) !== -1
    ),
    subType: RelationalOperator.Contains,
    case: 'default',
    regexp: /^((contains)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const equal: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) =>
        (isNumeric(op) && isNumeric(exp)) ?
            +op === +exp :
            op === exp
    ),
    subType: RelationalOperator.Equal,
    case: 'default',
    regexp: /^(=|(eq)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const greaterOrEqual: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) => op >= exp),
    subType: RelationalOperator.GreaterOrEqual,
    case: 'default',
    regexp: /^(>=|(ge)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const greaterThan: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) => op > exp),
    subType: RelationalOperator.GreaterThan,
    case: 'default',
    regexp: /^(>|(gt)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

const DATE_OPTIONS: IDateValidation = {
    allow_YY: true
};

export const dateStartsWith: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) => {
        op = typeof op === 'number' ? op.toString() : op;
        exp = typeof exp === 'number' ? exp.toString() : exp;

        const normalizedOp = normalizeDate(op, DATE_OPTIONS);
        const normalizedExp = normalizeDate(exp, DATE_OPTIONS);

        return !R.isNil(normalizedOp) &&
            !R.isNil(normalizedExp) &&
            // IE11 does not support `startsWith`
            normalizedOp.indexOf(normalizedExp) === 0;
    }),
    subType: RelationalOperator.DateStartsWith,
    regexp: /^((datestartswith)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const lessOrEqual: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) => op <= exp),
    subType: RelationalOperator.LessOrEqual,
    case: 'default',
    regexp: /^(<=|(le)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const lessThan: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) => op < exp),
    subType: RelationalOperator.LessThan,
    case: 'default',
    regexp: /^(<|(lt)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const notEqual: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) => op !== exp),
    subType: RelationalOperator.NotEqual,
    case: 'default',
    regexp: /^(!=|(ne)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const icontains: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) =>
        !R.isNil(exp) &&
        !R.isNil(op) &&
        (R.type(exp) === 'String' || R.type(op) === 'String') &&
        op.toString().toLowerCase().indexOf(exp.toString().toLowerCase()) !== -1
    ),
    subType: RelationalOperator.IContains,
    case: 'insensitive',
    regexp: /^((icontains)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const iequal: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) =>
        (isNumeric(op) && isNumeric(exp)) ?
            +op === +exp :
            op.toString().toLowerCase() === exp.toString().toLowerCase()
    ),
    subType: RelationalOperator.IEqual,
    case: 'insensitive',
    regexp: /^(i=|(ieq)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const igreaterOrEqual: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) =>
        (isNumeric(op) && isNumeric(exp)) ?
            +op >= +exp :
            op.toString().toLowerCase() >= exp.toString().toLowerCase()),
    subType: RelationalOperator.IGreaterOrEqual,
    case: 'insensitive',
    regexp: /^(i>=|(ige)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const igreaterThan: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) =>
        (isNumeric(op) && isNumeric(exp)) ?
            +op > +exp :
            op.toString().toLowerCase() > exp.toString().toLowerCase()),
    subType: RelationalOperator.IGreaterThan,
    case: 'insensitive',
    regexp: /^(i>|(igt)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const ilessOrEqual: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) =>
        (isNumeric(op) && isNumeric(exp)) ?
            +op <= +exp :
            op.toString().toLowerCase() <= exp.toString().toLowerCase()),
    subType: RelationalOperator.ILessOrEqual,
    case: 'insensitive',
    regexp: /^(i<=|(ile)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const ilessThan: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) =>
        (isNumeric(op) && isNumeric(exp)) ?
            +op < +exp :
            op.toString().toLowerCase() < exp.toString().toLowerCase()),
    subType: RelationalOperator.ILessThan,
    case: 'insensitive',
    regexp: /^(i<|(ilt)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const inotEqual: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) =>
        (isNumeric(op) && isNumeric(exp)) ?
            +op !== +exp :
            op.toString().toLowerCase() !== exp.toString().toLowerCase()),
    subType: RelationalOperator.INotEqual,
    case: 'insensitive',
    regexp: /^(i!=|(ine)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const scontains: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) =>
        !R.isNil(exp) &&
        !R.isNil(op) &&
        (R.type(exp) === 'String' || R.type(op) === 'String') &&
        op.toString().indexOf(exp.toString()) !== -1
    ),
    subType: RelationalOperator.SContains,
    case: 'insensitive',
    regexp: /^((scontains)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const sequal: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) =>
        (isNumeric(op) && isNumeric(exp)) ?
            +op === +exp :
            op === exp
    ),
    sType: RelationalOperator.SEqual,
    case: 'insensitive',
    regexp: /^(s=|(seq)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const sgreaterOrEqual: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) =>
        (isNumeric(op) && isNumeric(exp)) ?
            +op >= +exp :
            op >= exp),
    subType: RelationalOperator.SGreaterOrEqual,
    case: 'sensitive',
    regexp: /^(s>=|(sge)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const sgreaterThan: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) =>
        (isNumeric(op) && isNumeric(exp)) ?
            +op > +exp :
            op > exp),
    subType: RelationalOperator.SGreaterThan,
    case: 'sensitive',
    regexp: /^(s>|(sgt)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const slessOrEqual: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) =>
        (isNumeric(op) && isNumeric(exp)) ?
            +op <= +exp :
            op <= exp),
    subType: RelationalOperator.SLessOrEqual,
    case: 'sensitive',
    regexp: /^(s<=|(sle)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const slessThan: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) =>
        (isNumeric(op) && isNumeric(exp)) ?
            +op < +exp :
            op < exp),
    subType: RelationalOperator.SLessThan,
    case: 'sensitive',
    regexp: /^(s<|(slt)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const snotEqual: IUnboundedLexeme = R.mergeRight({
    evaluate: relationalEvaluator(([op, exp]) =>
        (isNumeric(op) && isNumeric(exp)) ?
            +op !== +exp :
            op !== exp),
    subType: RelationalOperator.SNotEqual,
    case: 'sensitive',
    regexp: /^(s!=|(sne)(?=\s|$))/i,
    regexpMatch: 1
}, LEXEME_BASE);

export const CaseMapping: Map<RelationalOperator, {
    lexeme: IUnboundedLexeme;
    value?: string;
}> = new Map([
    [RelationalOperator.Contains, { lexeme: icontains, value: 'icontains' }],
    [RelationalOperator.Equal, { lexeme: iequal, value: 'i=' }],
    [RelationalOperator.GreaterOrEqual, { lexeme: igreaterOrEqual, value: 'i>=' }],
    [RelationalOperator.GreaterThan, { lexeme: igreaterThan, value: 'i>' }],
    [RelationalOperator.LessOrEqual, { lexeme: ilessOrEqual, value: 'i<=' }],
    [RelationalOperator.LessThan, { lexeme: ilessThan, value: 'i<' }],
    [RelationalOperator.NotEqual, { lexeme: inotEqual, value: 'i!=' }]
]);
