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
    ifLeading
} from '.';

import { ILexeme } from 'core/syntax-tree/lexicon';

const lexicon: ILexeme[] = [
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
        terminal: false,
        if: ifLeading
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
        if: ifLeading,
        terminal: true
    })),
    ...[
        fieldExpression,
        stringExpression,
        valueExpression
    ].map(exp => ({
        ...exp,
        if: ifExpression,
        terminal: true
    }))
];

export default lexicon;