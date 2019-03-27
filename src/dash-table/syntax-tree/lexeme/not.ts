import Logger from 'core/Logger';
import { LexemeType, IUnboundedLexeme } from 'core/syntax-tree/lexicon';

const unaryNot: IUnboundedLexeme = {
    evaluate: (target, tree) => {
        Logger.trace('evaluate -> unary not', target, tree);

        const t = tree as any;

        return !t.right.lexeme.evaluate(target, t.right);
    },
    type: LexemeType.UnaryOperator,
    present: '!',
    priority: 1.5,
    regexp: /^!/,
    syntaxer: (lexs: any[]) => {
        return Object.assign({
            right: lexs.slice(1, lexs.length)
        }, lexs[0]);
    }
};

export default unaryNot;