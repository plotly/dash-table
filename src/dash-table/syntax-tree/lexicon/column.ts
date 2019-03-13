import {
    binaryOperator,
    expression,
    operand,
    unaryNot,
    unaryOperator
} from '../lexeme';

export default [
    operand,
    binaryOperator,
    unaryOperator,
    unaryNot,
    expression
];