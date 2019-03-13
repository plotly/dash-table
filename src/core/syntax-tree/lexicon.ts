import { ISyntaxTree } from 'core/syntax-tree/syntaxer';

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

export interface ILexeme {
    evaluate?: (target: any, tree: ISyntaxTree) => boolean;
    resolve?: (target: any, tree: ISyntaxTree) => any;
    name: string;
    nesting?: number;
    priority?: number;
    regexp: RegExp;
    syntaxer?: (lexs: any[], pivot: any, pivotIndex: number) => any;
    terminal?: boolean;
    when?: (string | undefined)[];
}

export interface ILexicon {
    allowFreeForm: boolean;
    lexemes: ILexeme[];
}