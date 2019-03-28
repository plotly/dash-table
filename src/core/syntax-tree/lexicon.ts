import { ILexemeResult } from './lexer';
import { ISyntaxTree } from './syntaxer';

export enum LexemeType {
    BlockClose = 'close-block',
    BlockOpen = 'open-block',
    LogicalOperator = 'logical-operator',
    RelationalOperator = 'relational-operator',
    UnaryOperator = 'unary-operator',
    Expression = 'expression',
    Operand = 'operand'
}

export interface IUnboundedLexeme {
    evaluate?: (target: any, tree: ISyntaxTree) => boolean;
    present?: (tree: ISyntaxTree) => string;
    resolve?: (target: any, tree: ISyntaxTree) => any;
    type: string;
    nesting?: number;
    priority?: number;
    regexp: RegExp | RegExp[];
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