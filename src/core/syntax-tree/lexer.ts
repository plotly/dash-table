import { ILexeme, ILexicon } from 'core/syntax-tree/lexicon';

export interface ILexerResult {
    lexemes: ILexemeResult[];
    valid: boolean;
    error?: string;
}

export interface ILexemeResult {
    lexeme: ILexeme;
    value?: string;
}

export default function lexer(lexicon: ILexicon, query: string): ILexerResult {
    let lexeme: ILexeme | null = null;

    let result: ILexemeResult[] = [];
    while (query.length) {
        query = query.replace(/^\s+/, '');

        let lexemes: ILexeme[] = lexicon.lexemes.filter(_lexeme => lexeme ?
            _lexeme.when && _lexeme.when.indexOf(lexeme.name) !== -1 :
            _lexeme.when && _lexeme.when.indexOf(undefined) !== -1
        );

        if (lexicon.allowFreeForm && !lexemes.length) {
            lexemes = lexicon.lexemes;
        }

        lexeme = lexemes.find(_lexeme => _lexeme.regexp.test(query)) || null;
        if (!lexeme) {
            return { lexemes: result, valid: false, error: query };
        }

        const value = (query.match(lexeme.regexp) || [])[0];
        result.push({ lexeme, value });

        query = query.substring(value.length);
    }

    const last = result.slice(-1)[0];

    return { lexemes: result, valid: !last || last.lexeme.terminal !== false };
}