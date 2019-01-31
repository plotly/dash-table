
import {
    ChangeEvent,
    ClipboardEvent,
    MouseEvent
} from 'react';

import { memoizeOneFactory } from 'core/memoizer';
import { ICellFactoryProps } from 'dash-table/components/Table/props';
import cellEventHandler, { Handler } from 'dash-table/derived/cell/eventHandler';

type CacheArgs = [number, number];

export type CacheFn = (...args: CacheArgs) => {
    onChange: (e: ChangeEvent) => void;
    onClick: (e: MouseEvent) => void;
    onDoubleClick: (e: MouseEvent) => void;
    onMouseUp: (e: MouseEvent) => void;
    onPaste: (e: ClipboardEvent<Element>) => void;
};
export type HandlerFn = (...args: any[]) => any;

const getter = (propsFn: () => ICellFactoryProps): CacheFn => {
    const derivedHandlers = cellEventHandler(propsFn);

    return (...args: CacheArgs) => {
        const [
            rowIndex,
            columnIndex
        ] = args;

        return {
            onChange: derivedHandlers(Handler.Change, columnIndex, rowIndex),
            onClick: derivedHandlers(Handler.Click, columnIndex, rowIndex),
            onDoubleClick: derivedHandlers(Handler.DoubleClick, columnIndex, rowIndex),
            onMouseUp: derivedHandlers(Handler.MouseUp, columnIndex, rowIndex),
            onPaste: derivedHandlers(Handler.Paste, columnIndex, rowIndex)
        } as any;
    };
};

export default memoizeOneFactory(getter);