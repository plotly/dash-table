import * as R from 'ramda';
import React from 'react';

import { memoizeOneFactory } from 'core/memoizer';

const getter = (
    inputs: JSX.Element[][],
    wrappers: JSX.Element[][]
): JSX.Element => {
    const cells = R.map(
        ([i, w]) => R.zip(i, w),
        R.zip(inputs, wrappers)
    );

    const mapTable = R.addIndex<JSX.Element[][], JSX.Element>(R.map);
    const mapRow = R.addIndex<JSX.Element[], JSX.Element>(R.map);

    return (<table>
        <tbody>
            {mapTable((row, rowIndex) => (<tr key={`row-${rowIndex}`}>
                {mapRow(([i, w], cellIndex) => React.cloneElement(w, {
                    children: [i],
                    tabIndex: -1,
                    key: `cell-${rowIndex}-${cellIndex}`
                }), row)}
            </tr>), cells)}
        </tbody>
    </table>);
};

export default memoizeOneFactory(getter);
