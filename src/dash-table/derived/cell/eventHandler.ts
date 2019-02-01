
import valueCache from 'core/cache/value';
import { ICellFactoryProps } from 'dash-table/components/Table/props';
import { handleChange, handleClick, handleDoubleClick, handleOnMouseUp, handlePaste } from 'dash-table/handlers/cellEvents';

type CacheArgs = [Handler, number, number];

export enum Handler {
    Change = 'change',
    Click = 'click',
    DoubleClick = 'doubleclick',
    MouseUp = 'mouseup',
    Paste = 'paste'
}

export type CacheFn = (...args: CacheArgs) => Function;
export type HandlerFn = (idx: number, i: number, e: any) => void;

export default (propsFn: () => ICellFactoryProps) => new EventHandler(propsFn).get;

class EventHandler {
    constructor(private readonly propsFn: () => ICellFactoryProps) {

    }

    private readonly cache = valueCache<[Handler, number, number]>()((
        handler: Handler,
        columnIndex: number,
        rowIndex: number
    ) => {
        switch (handler) {
            case Handler.Change:
                return handleChange.bind(undefined, this.propsFn, rowIndex, columnIndex);
            case Handler.Click:
                return handleClick.bind(undefined, this.propsFn, rowIndex, columnIndex);
            case Handler.DoubleClick:
                return handleDoubleClick.bind(undefined, this.propsFn, rowIndex, columnIndex);
            case Handler.MouseUp:
                return handleOnMouseUp.bind(undefined, this.propsFn, rowIndex, columnIndex);
            case Handler.Paste:
                return handlePaste.bind(undefined, this.propsFn, rowIndex, columnIndex);
            default:
                throw new Error(`unexpected handler ${handler}`);
        }
    });

    get = (
        handler: Handler,
        columnIndex: number,
        rowIndex: number
    ) => {
        return this.cache.get(handler, columnIndex, rowIndex);
    }
}