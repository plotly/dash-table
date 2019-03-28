import { ILexeme, Lexicon } from 'core/syntax-tree/lexicon';

export interface ILexerResult {
    lexemes: ILexemeResult[];
    valid: boolean;
    error?: string;
}

export interface ILexemeResult {
    lexeme: ILexeme;
    value?: string;
}

function findMatch(lexemes: ILexeme[], query: string): [ILexeme?, RegExp?] {
    for (let lexeme of lexemes) {
        if (Array.isArray(lexeme.regexp)) {
            for (let regexp of lexeme.regexp) {
                if (regexp.test(query)) {
                    return [lexeme, regexp];
                }
            }
        } else if (lexeme.regexp.test(query)) {
            return [lexeme, lexeme.regexp];
        }
    }

    return [undefined, undefined];
}

export default function lexer(lexicon: Lexicon, query: string): ILexerResult {
    let result: ILexemeResult[] = [];

    while (query.length) {
        query = query.replace(/^\s+/, '');

        const previous = result.slice(-1)[0];
        const previousLexeme = previous ? previous.lexeme : null;

        let lexemes: ILexeme[] = lexicon.filter(lexeme =>
            lexeme.if &&
            (!Array.isArray(lexeme.if) ?
                lexeme.if(result, previous) :
                (previousLexeme ?
                    lexeme.if && lexeme.if.indexOf(previousLexeme.type) !== -1 :
                    lexeme.if && lexeme.if.indexOf(undefined) !== -1))
        );

        const [next, regexp] = findMatch(lexemes, query);
        if (!next || !regexp) {
            return { lexemes: result, valid: false, error: query };
        }

        const value = (query.match(regexp) || [])[0];
        result.push({ lexeme: next, value });

        query = query.substring(value.length);
    }

    const last = result.slice(-1)[0];

    const terminal: boolean = last && (typeof last.lexeme.terminal === 'function' ?
        last.lexeme.terminal(result, last) :
        last.lexeme.terminal);

    return {
        lexemes: result,
        valid: !last || terminal
    };
}