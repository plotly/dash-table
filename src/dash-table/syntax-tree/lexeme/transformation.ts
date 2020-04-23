import { LexemeType, IUnboundedTypedLexeme } from 'core/syntax-tree/lexicon';

import { IDateValidation } from 'dash-table/components/Table/props';
import { DatePart, extractDateParts } from 'dash-table/type/date';
import { ISyntaxTree } from 'core/syntax-tree/syntaxer';

const DATE_OPTIONS: IDateValidation = {
    allow_YY: true
};

const evaluate = (part: DatePart, target: any, tree: ISyntaxTree): number | void => {
    const t = tree as any;

    let op = t.block.lexeme.evaluate(target, t.block);
    op = typeof op === 'number' ? op.toString() : op;

    return extractDateParts(op, DATE_OPTIONS)?.[part];
};

const syntaxer = (lexs: any[]) => {
    const block = lexs.slice(1, lexs.length - 1);

    return Object.assign({
        block: block.length === 1 ? block[0] : block
    }, lexs[0]);
};

const getDateLexeme = (part: DatePart, subType: string, regexp: RegExp): IUnboundedTypedLexeme<number> => ({
    evaluate: evaluate.bind(undefined, part),
    nesting: 1,
    priority: 1,
    regexp,
    subType,
    syntaxer,
    type: LexemeType.Transformation
});

export const year = getDateLexeme(DatePart.Year, 'year', /(^year\()/);
export const month = getDateLexeme(DatePart.Month, 'month', /(^month\()/);
export const day = getDateLexeme(DatePart.Day, 'day', /(^day\()/);
export const hour = getDateLexeme(DatePart.Hour, 'hour', /(^hour\()/);
export const minute = getDateLexeme(DatePart.Minute, 'minute', /(^minute\()/);
export const second = getDateLexeme(DatePart.Second, 'second', /(^second\()/);