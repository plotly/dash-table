import Logger from 'core/Logger';
import { LexemeType } from 'core/syntax-tree/lexicon';
import { ISyntaxTree } from 'core/syntax-tree/syntaxer';

import equal from './equal';
import greaterOrEqual from './greaterOrEqual';
import greaterThan from './greaterThan';
import lessOrEqual from './lessOrEqual';
import lessThan from './lessThan';
import notEqual from './notEqual';

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

export function relationalEvaluator(
    fn: ([opValue, expValue]: any[]) => boolean
) {
    return (target: any, tree: ISyntaxTree) => fn(evaluator(target, tree));
}

export const LEXEME_BASE = {
    name: LexemeType.RelationalOperator,
    priority: 0,
    regexp: /^(=|eq)/i,
    syntaxer: relationalSyntaxer
};

export { equal, greaterOrEqual, greaterThan, lessOrEqual, lessThan, notEqual };