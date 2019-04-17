import * as R from 'ramda';

import {
    fieldExpression,
    stringExpression,
    valueExpression
} from '../lexeme/expression';
import {
    contains,
    equal,
    greaterOrEqual,
    greaterThan,
    lessOrEqual,
    lessThan,
    notEqual
} from '../lexeme/relational';
import {
    isBool,
    isEven,
    isNil,
    isNum,
    isObject,
    isOdd,
    isPrime,
    isStr
} from '../lexeme/unary';

import { LexemeType, ILexeme } from 'core/syntax-tree/lexicon';
import { ILexemeResult } from 'core/syntax-tree/lexer';
import { ColumnId, ColumnType } from 'dash-table/components/Table/props';

export interface ISingleColumnConfig {
    id: ColumnId;
    type: ColumnType | undefined;
}

type LexemeResult = ILexemeResult<ISingleColumnConfig>;

const lexicon: ILexeme<ISingleColumnConfig>[] = [
    ...[equal,
        greaterOrEqual,
        greaterThan,
        lessOrEqual,
        lessThan,
        notEqual
    ].map(op => ({
        ...op,
        terminal: false,
        if: (_lexs: LexemeResult[], previous: LexemeResult) => !previous
    })),
    {
        ...contains,
        terminal: false,
        if: (
            _lexs: LexemeResult[],
            previous: LexemeResult,
            config: ISingleColumnConfig
        ) => !previous && config.type === ColumnType.Text
    },
    ...[isBool,
        isEven,
        isNil,
        isNum,
        isObject,
        isOdd,
        isPrime,
        isStr
    ].map(op => ({
        ...op,
        if: (_lexs: LexemeResult[], previous: LexemeResult) => !previous,
        terminal: true
    })),
    ...[
        fieldExpression,
        stringExpression,
        valueExpression
    ].map(exp => ({
        ...exp,
        if: (_lexs: LexemeResult[], previous: LexemeResult) =>
            !previous || R.contains(
                previous.lexeme.type,
                [LexemeType.RelationalOperator]
            ),
        terminal: true
    }))
];

export default lexicon;