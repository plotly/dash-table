import * as R from 'ramda';

import Logger from 'core/Logger';
import lexer, { ILexerResult } from 'core/syntax-tree/lexer';
import syntaxer, { ISyntaxerResult } from 'core/syntax-tree/syntaxer';
import { Lexicon } from './lexicon';

export default class SyntaxTree {
    protected lexerResult: ILexerResult;
    protected syntaxerResult: ISyntaxerResult;

    get isValid() {
        return this.syntaxerResult.valid;
    }

    private get tree() {
        return this.syntaxerResult.tree;
    }

    constructor(
        public readonly lexicon: Lexicon,
        public readonly query: string,
        modifyLex: (res: ILexerResult) => ILexerResult = res => res
    ) {
        this.lexerResult = modifyLex(lexer(this.lexicon, this.query));
        this.syntaxerResult = syntaxer(this.lexerResult);
    }

    evaluate = (target: any) => {
        if (!this.isValid) {
            const msg = `unable to evaluate target: syntax tree is invalid for query=${this.query}`;

            Logger.error(msg);
            throw new Error(msg);
        }

        return this.tree && this.tree.lexeme && this.tree.lexeme.evaluate ?
            this.tree.lexeme.evaluate(target, this.tree) :
            true;
    }

    filter = (targets: any[]) => {
        return targets.filter(this.evaluate);
    }

    toQueryString() {
        return this.lexerResult.valid ?
            R.map(l => l.value, this.lexerResult.lexemes).join(' ') :
            '';
    }
}