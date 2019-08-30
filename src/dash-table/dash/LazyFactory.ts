import { lazy } from 'react';

type Boolean = Promise<boolean> | boolean;
type LazyComponent = React.LazyExoticComponent<React.ComponentType<any>>;

interface IResult {
    isReady: Boolean,
    get: LazyComponent
}

export default (
    target: () => JSX.Element,
    promise: () => Promise<{ default: React.ComponentType<any> }>
): LazyComponent => {
    let resolve: (value: Boolean) => void;
    const isReady = new Promise<boolean>(r => {
        resolve = r;
    });

    const state: IResult = {
        isReady,
        get: lazy(async () => {
            // let __r: any;
            // const p = new Promise(_r => __r = _r);
            // setTimeout(() => __r(), 10000);

            // await p;

            // delay `isReady`
            setTimeout(async () => {
                await resolve(true);
                state.isReady = true;
            }, 0);

            return await promise();
        })
    };

    Object.defineProperty(target, '_dashprivate_isLazyComponentReady', {
        get: () => state.isReady
    });

    return state.get;
}