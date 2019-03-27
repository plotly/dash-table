import { IUnboundedLexeme } from 'core/syntax-tree/lexicon';
import { relationalEvaluator, LEXEME_BASE } from './index';

const greaterThan: IUnboundedLexeme = {
    evaluate: relationalEvaluator(([op, exp]) => op > exp),
    ...LEXEME_BASE
};

export default greaterThan;
