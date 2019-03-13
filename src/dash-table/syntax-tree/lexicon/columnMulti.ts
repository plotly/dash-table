import {
    and
} from '../lexeme';
import columnLexicon from './column';
import { ILexeme, LexemeType } from 'core/syntax-tree/lexicon';
import { ILexemeResult } from 'core/syntax-tree/lexer';
import R from 'ramda';

const lexicon: ILexeme[] = [
    {
        ...and,
        if: (_: ILexemeResult[], previous: ILexemeResult) =>
            previous && R.contains(
                previous.lexeme.name,
                [
                    LexemeType.Expression,
                    LexemeType.UnaryOperator
                ]
            ),
        terminal: false
    },
    ...columnLexicon
];

export default lexicon;