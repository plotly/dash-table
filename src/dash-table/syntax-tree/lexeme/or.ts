import Logger from 'core/Logger';
import { ILexeme, LexemeType } from 'core/syntax-tree/lexicon';

const or: ILexeme = {
    evaluate: (target, tree) => {
        Logger.trace('evaluate -> ||', target, tree);

        const t = tree as any;

        return t.left.lexeme.evaluate(target, t.left) ||
            t.right.lexeme.evaluate(target, t.right);
    },
    name: LexemeType.Or,
    priority: 3,
    regexp: /^(or\s|\|\|)/i,
    syntaxer: (lexs: any[], pivot: any, pivotIndex: number) => {
        return Object.assign({
            left: lexs.slice(0, pivotIndex),
            right: lexs.slice(pivotIndex + 1)
        }, pivot);
    }
};

export default or;