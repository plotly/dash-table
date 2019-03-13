import { ILexemeResult } from './lexer';
import { ISyntaxTree } from './syntaxer';

export enum LexemeType {
    And = 'and',
    BlockClose = 'close-block',
    BlockOpen = 'open-block',
    BinaryOperator = 'logical-binary-operator',
    Expression = 'expression',
    Or = 'or',
    Operand = 'operand',
    UnaryNot = 'unary-not',
    UnaryOperator = 'logical-unary-operator'
}

export interface IUnboundedLexeme {
    evaluate?: (target: any, tree: ISyntaxTree) => boolean;
    resolve?: (target: any, tree: ISyntaxTree) => any;
    name: string;
    nesting?: number;
    priority?: number;
    regexp: RegExp;
    syntaxer?: (lexs: any[], pivot: any, pivotIndex: number) => any;
}

export interface ILexeme extends IUnboundedLexeme {
    terminal: boolean | ((lexemes: ILexemeResult[], previous: ILexemeResult) => boolean);
    if: (string | undefined)[] | ((lexemes: ILexemeResult[], previous: ILexemeResult) => boolean);
}

export function boundLexeme(lexeme: IUnboundedLexeme) {
    return { ...lexeme, if: () => false, terminal: false };
}

export type Lexicon = ILexeme[];