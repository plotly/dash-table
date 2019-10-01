import {
    fieldExpression,
    stringExpression,
    permissiveValueExpression
} from '../lexeme/expression';
import {
    contains,
    dateStartsWith,
    equal,
    greaterOrEqual,
    greaterThan,
    lessOrEqual,
    lessThan,
    notEqual,
    icontains,
    iequal,
    igreaterOrEqual,
    igreaterThan,
    ilessOrEqual,
    ilessThan,
    inotEqual,
    scontains,
    sequal,
    sgreaterOrEqual,
    sgreaterThan,
    slessOrEqual,
    slessThan,
    snotEqual
} from '../lexeme/relational';
import {
    isBlank,
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
        dateStartsWith,
        equal,
        greaterOrEqual,
        greaterThan,
        lessOrEqual,
        lessThan,
        notEqual,
        icontains,
        iequal,
        igreaterOrEqual,
        igreaterThan,
        ilessOrEqual,
        ilessThan,
        inotEqual,
        scontains,
        sequal,
        sgreaterOrEqual,
        sgreaterThan,
        slessOrEqual,
        slessThan,
        snotEqual
    ].map(op => ({
        ...op,
        if: ifLeading,
        terminal: false
    })),
    ...[isBlank,
        isBool,
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
        permissiveValueExpression,
        stringExpression
    ].map(exp => ({
        ...exp,
        if: ifExpression,
        terminal: true
    }))
];

export default lexicon;