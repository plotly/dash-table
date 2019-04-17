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
    present?: (tree: ISyntaxTree) => any;
    resolve?: (target: any, tree: ISyntaxTree) => any;
    subType?: string;
    type: string;
    nesting?: number;
    priority?: number;
    regexp: RegExp;
    regexpMatch?: number;
    syntaxer?: (lexs: any[], pivot: any, pivotIndex: number) => any;
}

type Terminal<TConfig = undefined> = boolean |
    ((lexemes: ILexemeResult<TConfig>[], previous: ILexemeResult<TConfig>) => boolean) |
    ((lexemes: ILexemeResult<TConfig>[], previous: ILexemeResult<TConfig>, config: TConfig) => boolean);

type If<TConfig = undefined> = (string | undefined)[] |
    ((lexemes: ILexemeResult<TConfig>[], previous: ILexemeResult<TConfig>) => boolean) |
    ((lexemes: ILexemeResult<TConfig>[], previous: ILexemeResult<TConfig>, config: TConfig) => boolean);

export interface ILexeme<TConfig = undefined> extends IUnboundedLexeme {
    terminal: Terminal<TConfig>;
    if: If<TConfig>;
}

export function boundLexeme(lexeme: IUnboundedLexeme) {
    return { ...lexeme, if: () => false, terminal: false };
}

export type Lexicon<TConfig = undefined> = ILexeme<TConfig>[];