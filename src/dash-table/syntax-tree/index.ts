import * as R from 'ramda';

import SyntaxTree from 'core/syntax-tree';
import { ILexerResult, ILexemeResult } from 'core/syntax-tree/lexer';
import { LexemeType, boundLexeme } from 'core/syntax-tree/lexicon';
import { ISyntaxTree } from 'core/syntax-tree/syntaxer';

import { ColumnId } from 'dash-table/components/Table/props';

import { operand, binaryOperator } from './lexeme';
import queryLexicon from './lexicon/query';
import columnLexicon from './lexicon/column';
import columnMultiLexicon from './lexicon/columnMulti';

function isBinary(lexemes: ILexemeResult[]) {
    return lexemes.length === 2;
}

function isExpression(lexemes: ILexemeResult[]) {
    return lexemes.length === 1 &&
        lexemes[0].lexeme.name === LexemeType.Expression;
}

function isUnary(lexemes: ILexemeResult[]) {
    return lexemes.length === 1 &&
        lexemes[0].lexeme.name === LexemeType.UnaryOperator;
}

function modifyLex(key: ColumnId, res: ILexerResult) {
    if (!res.valid) {
        return res;
    }

    if (isBinary(res.lexemes) || isUnary(res.lexemes)) {
        res.lexemes = [
            { lexeme: boundLexeme(operand), value: `${key}` },
            ...res.lexemes
        ];
    } else if (isExpression(res.lexemes)) {
        res.lexemes = [
            { lexeme: boundLexeme(operand), value: `${key}` },
            { lexeme: boundLexeme(binaryOperator), value: 'eq' },
            ...res.lexemes
        ];
    }

    return res;
}

export class SingleColumnSyntaxTree extends SyntaxTree {
    constructor(key: ColumnId, query: string) {
        super(columnLexicon, query, modifyLex.bind(undefined, key));
    }
}

export class MultiColumnsSyntaxTree extends SyntaxTree {
    constructor(query: string) {
        super(columnMultiLexicon, query);
    }

    get isValid() {
        return super.isValid &&
            this.respectsBasicSyntax();
    }

    get statements() {
        if (!this.syntaxerResult.tree) {
            return;
        }

        const statements: ISyntaxTree[] = [];

        const toCheck: ISyntaxTree[] = [this.syntaxerResult.tree];
        while (toCheck.length) {
            const item = toCheck.pop();
            if (!item) {
                continue;
            }

            statements.push(item);

            if (item.left) { toCheck.push(item.left); }
            if (item.block) { toCheck.push(item.block); }
            if (item.right) { toCheck.push(item.right); }
        }

        return statements;
    }

    private respectsBasicSyntax() {
        const fields = R.map(
            item => item.value,
            R.filter(
                i => i.lexeme.name === LexemeType.Operand,
                this.lexerResult.lexemes
            )
        );

        const uniqueFields = R.uniq(fields);

        return fields.length === uniqueFields.length;
    }
}

export class QuerySyntaxTree extends SyntaxTree {
    constructor(query: string) {
        super(queryLexicon, query);
    }
}