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
    let isReady = new Promise<boolean>(r => {
        resolve = r;
    });

    const state: IResult = {
        isReady,
        get: lazy(async () => {
            const component = await promise();

            await resolve(true);
            state.isReady = true;

            return component;
        })
    };

    Object.defineProperty(target, '_dashprivate_isLazyComponentReady', {
        get: () => state.isReady
    });

    return state.get;
}