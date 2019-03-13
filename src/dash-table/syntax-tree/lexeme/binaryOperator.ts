import Logger from 'core/Logger';
import { LexemeType, ILexeme } from 'core/syntax-tree/lexicon';

const binaryOperator: ILexeme = {
    evaluate: (target, tree) => {
        Logger.trace('evaluate -> binary', target, tree);

        const t = tree as any;

        const opValue = t.left.lexeme.resolve(target, t.left);
        const expValue = t.right.lexeme.resolve(target, t.right);
        Logger.trace(`opValue: ${opValue}, expValue: ${expValue}`);

        switch (tree.value.toLowerCase()) {
            case 'eq':
            case '=':
                return opValue === expValue;
            case 'gt':
            case '>':
                return opValue > expValue;
            case 'ge':
            case '>=':
                return opValue >= expValue;
            case 'lt':
            case '<':
                return opValue < expValue;
            case 'le':
            case '<=':
                return opValue <= expValue;
            case 'ne':
            case '!=':
                return opValue !== expValue;
            default:
                throw new Error();
        }
    },
    name: LexemeType.BinaryOperator,
    priority: 0,
    regexp: /^(>=|<=|>|<|!=|=|ge|le|gt|lt|eq|ne)/i,
    syntaxer: (lexs: any[]) => {
        let [left, lexeme, right] = lexs;

        return Object.assign({ left, right }, lexeme);
    },
    when: [LexemeType.Operand]
};

export default binaryOperator;