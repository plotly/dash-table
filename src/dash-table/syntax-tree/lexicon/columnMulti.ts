import { ILexeme } from 'core/syntax-tree/lexicon';

import {
    fieldExpression,
    stringExpression,
    valueExpression
} from '../lexeme/expression';
import {
    and
} from '../lexeme/logical';
import {
    contains,
    equal,
    greaterOrEqual,
    greaterThan,
    lessOrEqual,
    lessThan,
    likeDate,
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

import {
    ifExpression,
    ifLogicalOperator,
    ifRelationalOperator,
    ifUnaryOperator,
    isTerminalExpression
} from '.';

const lexicon: ILexeme[] = [
    {
        ...and,
        if: ifLogicalOperator,
        terminal: false
    },
    ...[contains,
        equal,
        greaterOrEqual,
        greaterThan,
        lessOrEqual,
        lessThan,
        likeDate,
        notEqual
    ].map(op => ({
        ...op,
        if: ifRelationalOperator,
        terminal: false
    })),
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
        if: ifUnaryOperator,
        terminal: true
    })),
    ...[
        fieldExpression,
        stringExpression,
        valueExpression
    ].map(exp => ({
        ...exp,
        if: ifExpression,
        terminal: isTerminalExpression
    }))
];

export default lexicon;