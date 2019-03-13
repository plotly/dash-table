import Logger from 'core/Logger';
import { LexemeType, ILexeme } from 'core/syntax-tree/lexicon';

const and: ILexeme = {
    evaluate: (target, tree) => {
        Logger.trace('evaluate -> &&', target, tree);

        const t = tree as any;
        const lv = t.left.lexeme.evaluate(target, t.left);
        const rv = t.right.lexeme.evaluate(target, t.right);
        return lv && rv;
    },
    name: LexemeType.And,
    priority: 2,
    regexp: /^(and\s|&&)/i,
    syntaxer: (lexs: any[], pivot: any, pivotIndex: number) => {
        return Object.assign({
            left: lexs.slice(0, pivotIndex),
            right: lexs.slice(pivotIndex + 1)
        }, pivot);
    }
};

export default and;