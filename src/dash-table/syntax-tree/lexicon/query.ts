import {
    and,
    binaryOperator,
    blockClose,
    blockOpen,
    expression,
    operand,
    or,
    unaryNot,
    unaryOperator
} from '../lexeme';

export default [
    and,
    or,
    blockClose,
    blockOpen,
    operand,
    binaryOperator,
    unaryOperator,
    unaryNot,
    expression
];