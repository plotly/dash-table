import {
    and
} from '../lexeme';
import column from './column';

export default {
    allowFreeForm: true,
    lexemes: [
        and,
        ...column.lexemes
    ]
};