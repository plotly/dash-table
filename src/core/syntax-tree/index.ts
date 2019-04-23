import * as R from 'ramda';

import Logger from 'core/Logger';
import { ILexerResult, configurableLexer } from 'core/syntax-tree/lexer';
import syntaxer, { ISyntaxerResult, ISyntaxTree } from 'core/syntax-tree/syntaxer';
import { Lexicon } from './lexicon';

interface IStructure {
    subType?: string;
    type: string;
    value: any;

    block?: IStructure;
    left?: IStructure;
    right?: IStructure;
}

function toStructure(tree: ISyntaxTree): IStructure {
    const { block, left, lexeme, right, value } = tree;

    const res: IStructure = {
        subType: lexeme.subType,
        type: lexeme.type,
        value: lexeme.present ? lexeme.present(tree) : value
    };

    if (block) {
        res.block = toStructure(block);
    }

    if (left) {
        res.left = toStructure(left);
    }

    if (right) {
        res.right = toStructure(right);
    }

    return res;
}

export default class SyntaxTree<TConfig = undefined> {
    protected lexerResult: ILexerResult<TConfig>;
    protected syntaxerResult: ISyntaxerResult;

    get isValid() {
        return this.syntaxerResult.valid;
    }

    private get tree() {
        return this.syntaxerResult.tree;
    }

    constructor(
        public readonly lexicon: Lexicon<TConfig>,
        public readonly query: string,
        public readonly config: TConfig,
        postProcessor: (res: ILexerResult<TConfig>) => ILexerResult<TConfig> = res => res
    ) {
        this.lexicon = R.map(lexeme => R.merge(lexeme, {
            evaluate: lexeme.boundedEvaluate ?
                lexeme.boundedEvaluate.bind(undefined, config) :
                lexeme.evaluate
        }), lexicon);

        this.lexerResult = postProcessor(configurableLexer<TConfig>(this.lexicon, this.query, this.config));
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

    toStructure() {
        if (!this.isValid || !this.syntaxerResult.tree) {
            return null;
        }

        return toStructure(this.syntaxerResult.tree);
    }
}