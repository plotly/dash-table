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

function relationalEvaluator(
    fn: ([opValue, expValue]: any[]) => boolean
) {
    return (target: any, tree: ISyntaxTree) => fn(evaluator(target, tree));
}

function relationalSyntaxer([left, lexeme, right]: any[]) {
    return Object.assign({ left, right }, lexeme);
}

const LEXEME_BASE = {
    name: LexemeType.RelationalOperator,
    priority: 0,
    regexp: /^(=|eq)/i,
    syntaxer: relationalSyntaxer
};

const equal: IUnboundedLexeme = {
    evaluate: relationalEvaluator(([op, exp]) => op === exp),
    ...LEXEME_BASE
};

const greaterOrEqual: IUnboundedLexeme = {
    evaluate: relationalEvaluator(([op, exp]) => op >= exp),
    ...LEXEME_BASE
};

const greaterThan: IUnboundedLexeme = {
    evaluate: relationalEvaluator(([op, exp]) => op > exp),
    ...LEXEME_BASE
};

const lessOrEqual: IUnboundedLexeme = {
    evaluate: relationalEvaluator(([op, exp]) => op <= exp),
    ...LEXEME_BASE
};

const lessThan: IUnboundedLexeme = {
    evaluate: relationalEvaluator(([op, exp]) => op < exp),
    ...LEXEME_BASE
};

const notEqual: IUnboundedLexeme = {
    evaluate: relationalEvaluator(([op, exp]) => op !== exp),
    ...LEXEME_BASE
};

export { equal, greaterOrEqual, greaterThan, lessOrEqual, lessThan, notEqual };