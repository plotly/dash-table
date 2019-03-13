import Logger from 'core/Logger';
import { LexemeType, ILexeme } from 'core/syntax-tree/lexicon';

export const blockClose: ILexeme = {
    name: LexemeType.BlockClose,
    nesting: -1,
    regexp: /^\)/
};

export const blockOpen: ILexeme = {
    evaluate: (target, tree) => {
        Logger.trace('evaluate -> ()', target, tree);

        const t = tree as any;

        return t.block.lexeme.evaluate(target, t.block);
    },
    name: LexemeType.BlockOpen,
    nesting: 1,
    priority: 1,
    regexp: /^\(/,
    syntaxer: (lexs: any[]) => {
        return Object.assign({
            block: lexs.slice(1, lexs.length - 1)
        }, lexs[0]);
    },
    when: [LexemeType.UnaryNot]
};