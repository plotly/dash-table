import * as R from 'ramda';

import { LexemeType } from 'core/syntax-tree/lexicon';

import MultiColumnsSyntaxTree from './MultiColumnsSyntaxTree';
import QuerySyntaxTree from './QuerySyntaxTree';
import SingleColumnSyntaxTree from './SingleColumnSyntaxTree';

export const getMultiColumnQueryString = (
    asts: SingleColumnSyntaxTree[]
) => R.map(
    ast => ast.toQueryString(),
    R.filter(ast => ast && ast.isValid, asts)
    ).join(' && ');

export const getSingleColumnMap = (ast: MultiColumnsSyntaxTree) => {
    if (!ast.isValid) {
        return;
    }

    const map = new Map<string, SingleColumnSyntaxTree>();

    const statements = ast.statements;
    if (!statements) {
        return map;
    }

    R.forEach(s => {
        if (s.lexeme.name === LexemeType.UnaryOperator && s.block) {
            map.set(s.block.value, new SingleColumnSyntaxTree(s.block.value, s.value));
        } else if (s.lexeme.name === LexemeType.RelationalOperator && s.left && s.right) {
            map.set(s.left.value, new SingleColumnSyntaxTree(s.left.value, `${s.value} ${s.right.value}`));
        }
    }, statements);

    return map;
};

export { MultiColumnsSyntaxTree, QuerySyntaxTree, SingleColumnSyntaxTree };