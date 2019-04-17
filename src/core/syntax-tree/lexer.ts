import * as R from 'ramda';

import { ILexeme, Lexicon } from 'core/syntax-tree/lexicon';

export interface ILexerResult<TConfig = undefined> {
    lexemes: ILexemeResult<TConfig>[];
    valid: boolean;
    error?: string;
}

export interface ILexemeResult<TConfig = undefined> {
    lexeme: ILexeme<TConfig>;
    value?: string;
}

export default function lexer(lexicon: Lexicon, query: string) {
    return configurableLexer<undefined>(lexicon, query, undefined);
}

export function configurableLexer<TConfig>(
    lexicon: Lexicon<TConfig>,
    query: string,
    config: TConfig
): ILexerResult<TConfig> {
    let result: ILexemeResult<TConfig>[] = [];

    while (query.length) {
        query = query.replace(/^\s+/, '');

        const previous = result.slice(-1)[0];
        const previousLexeme = previous ? previous.lexeme : null;

        let lexemes: ILexeme<TConfig>[] = lexicon.filter(lexeme =>
            lexeme.if &&
            (!Array.isArray(lexeme.if) ?
                lexeme.if(result, previous, config) :
                (previousLexeme ?
                    lexeme.if && lexeme.if.indexOf(previousLexeme.type) !== -1 :
                    lexeme.if && lexeme.if.indexOf(undefined) !== -1))
        );

        const next = R.find(lexeme => lexeme.regexp.test(query), lexemes);
        if (!next) {
            return { lexemes: result, valid: false, error: query };
        }

        const value = (query.match(next.regexp) || [])[next.regexpMatch || 0];
        result.push({ lexeme: next, value });

        query = query.substring(value.length);
    }

    const last = result.slice(-1)[0];

    const terminal: boolean = last && (typeof last.lexeme.terminal === 'function' ?
        last.lexeme.terminal(result, last, config) :
        last.lexeme.terminal);

    return {
        lexemes: result,
        valid: !last || terminal
    };
}