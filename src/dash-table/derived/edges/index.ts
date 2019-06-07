import * as R from 'ramda';

import { BorderStyle, BORDER_PROPERTIES, BorderProp } from './type';
import { IConvertedStyle } from '../style';

const indexedMap = <T>(a: T[]) => R.addIndex<T, [T, number]>(R.map)((e: T, i: number) => [e, i], a);

export const getBorderStyle = (styles: IConvertedStyle[]): BorderStyle => R.reduce(
    (res: BorderStyle, [style, i]) => R.reduce(
        (acc: BorderStyle, p: BorderProp): BorderStyle =>
            R.ifElse(
                R.compose(R.not, R.isNil),
                s => (acc[p] = [s, i]) && acc,
                () => acc
            )(style.style[p] || style.style.border),
        res,
        BORDER_PROPERTIES
    ), {}, indexedMap(styles));