import * as R from 'ramda';

import SyntaxTree from 'core/syntax-tree';
import { LexemeType } from 'core/syntax-tree/lexicon';
import { ISyntaxTree } from 'core/syntax-tree/syntaxer';

import queryLexicon from './lexicon/query';
import columnLexicon from './lexicon/column';
import columnMultiLexicon from './lexicon/columnMulti';

export class SingleColumnSyntaxTree extends SyntaxTree {
    constructor(query: string) {
        super(columnLexicon, query);
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