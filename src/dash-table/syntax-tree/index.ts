import * as R from 'ramda';

import { LexemeType } from 'core/syntax-tree/lexicon';

import MultiColumnsSyntaxTree from './MultiColumnsSyntaxTree';
import QuerySyntaxTree from './QuerySyntaxTree';
import SingleColumnSyntaxTree from './SingleColumnSyntaxTree';
import { RelationalOperator } from './lexeme/relational';
import { IColumn } from 'dash-table/components/Table/props';

export const getMultiColumnQueryString = (
    asts: SingleColumnSyntaxTree[]
) => R.map(
    ast => ast.toQueryString(),
    R.filter<SingleColumnSyntaxTree>(ast => ast && ast.isValid && ast.query !== '', asts)
    ).join(' && ');

export const getSingleColumnMap = (
    ast: MultiColumnsSyntaxTree,
    columns: IColumn[]
) => {
    if (!ast.isValid) {
        return;
    }

    const map = new Map<string, SingleColumnSyntaxTree>();

    const statements = ast.statements;
    if (!statements) {
        return map;
    }

    R.forEach(s => {
        if (s.lexeme.type === LexemeType.UnaryOperator && s.left) {
            const sanitizedColumnId = s.left.lexeme.present ? s.left.lexeme.present(s.left) : s.left.value;

            const column = R.find(c => c.id.toString() === sanitizedColumnId, columns);
            if (!column) {
                throw new Error(`column ${sanitizedColumnId} not found`);
            }

            map.set(sanitizedColumnId, new SingleColumnSyntaxTree(s.value, column));
        } else if (s.lexeme.type === LexemeType.RelationalOperator && s.left && s.right) {
            const sanitizedColumnId = s.left.lexeme.present ? s.left.lexeme.present(s.left) : s.left.value;

            const column = R.find(c => c.id.toString() === sanitizedColumnId, columns);
            if (!column) {
                throw new Error(`column ${sanitizedColumnId} not found`);
            }

            if (s.lexeme.present && s.lexeme.present(s) === RelationalOperator.Equal) {
                map.set(sanitizedColumnId, new SingleColumnSyntaxTree(`${s.right.value}`, column));
            } else {
                map.set(sanitizedColumnId, new SingleColumnSyntaxTree(`${s.value} ${s.right.value}`, column));
            }
        }
    }, statements);

    return map;
};

export { MultiColumnsSyntaxTree, QuerySyntaxTree, SingleColumnSyntaxTree };