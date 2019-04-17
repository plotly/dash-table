import SyntaxTree from 'core/syntax-tree';
import { ILexemeResult, ILexerResult } from 'core/syntax-tree/lexer';
import { LexemeType, boundLexeme } from 'core/syntax-tree/lexicon';

import { ColumnType } from 'dash-table/components/Table/props';

import operand from './lexeme/operand';
import { equal, RelationalOperator } from './lexeme/relational';

import columnLexicon, { ISingleColumnConfig } from './lexicon/column';

function isBinary(lexemes: ILexemeResult<ISingleColumnConfig>[]) {
    return lexemes.length === 2;
}

function isExpression(lexemes: ILexemeResult<ISingleColumnConfig>[]) {
    return lexemes.length === 1 &&
        lexemes[0].lexeme.type === LexemeType.Expression;
}

function isUnary(lexemes: ILexemeResult<ISingleColumnConfig>[]) {
    return lexemes.length === 1 &&
        lexemes[0].lexeme.type === LexemeType.UnaryOperator;
}

export function modifyLex(config: ISingleColumnConfig, res: ILexerResult<ISingleColumnConfig>) {
    if (!res.valid) {
        return res;
    }

    if (isBinary(res.lexemes) || isUnary(res.lexemes)) {
        res.lexemes = [
            { lexeme: boundLexeme(operand), value: `{${config.id}}` },
            ...res.lexemes
        ];
    } else if (isExpression(res.lexemes)) {
        res.lexemes = [
            { lexeme: boundLexeme(operand), value: `{${config.id}}` },
            {
                lexeme: boundLexeme(equal),
                value: config.type === ColumnType.Text ?
                    RelationalOperator.Contains :
                    RelationalOperator.Equal
            },
            ...res.lexemes
        ];
    }

    return res;
}

export default class SingleColumnSyntaxTree extends SyntaxTree<ISingleColumnConfig> {
    constructor(query: string, config: ISingleColumnConfig) {
        super(
            columnLexicon,
            query,
            config,
            modifyLex.bind(undefined, config)
        );
    }
}