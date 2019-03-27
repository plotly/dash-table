import * as R from 'ramda';

import {
    equal,
    greaterOrEqual,
    greaterThan,
    lessOrEqual,
    lessThan,
    notEqual,
    expression,
    unaryOperator
} from '../lexeme';
import { LexemeType, ILexeme } from 'core/syntax-tree/lexicon';
import { ILexemeResult } from 'core/syntax-tree/lexer';

const lexicon: ILexeme[] = [
    ...[equal, greaterOrEqual, greaterThan, lessOrEqual, lessThan, notEqual].map(op => ({
        ...op,
        terminal: false,
        if: (_lexs: ILexemeResult[], previous: ILexemeResult) => !previous
    })),
    {
        ...unaryOperator,
        if: (_lexs: ILexemeResult[], previous: ILexemeResult) => !previous,
        terminal: true
    },
    {
        ...expression,
        if: (_lexs: ILexemeResult[], previous: ILexemeResult) =>
            !previous || R.contains(
                previous.lexeme.name,
                [LexemeType.RelationalOperator]
            ),
        terminal: true
    }
];

export default lexicon;