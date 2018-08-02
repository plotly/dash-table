import * as R from 'ramda';

import AbstractStrategy, { ITarget } from './AbstractStrategy';

export default class NoStrategy extends AbstractStrategy<undefined> {
    constructor(target: ITarget<undefined>) {
        super(target);

        this.refresh();
    }

    protected getDataframe() {
        let { dataframe } = this.target;

        return { dataframe, indices: R.range(0, dataframe.length) };
    }

    public get offset() {
        return 0;
    }

    public loadNext() {

    }

    public loadPrevious() {

    }
}