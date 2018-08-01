import * as R from 'ramda';

import AbstractStrategy, { ITarget } from './AbstractStrategy';

export default class NoStrategy extends AbstractStrategy<undefined> {
    constructor(target: ITarget<undefined>) {
        super(target);

        this.refresh();
    }

    protected refresh() {
        this.target.update({
            dataframe: this.dataframe,
            viewportDataframe: this.dataframe,
            viewportIndices: R.range(0, this.dataframe.length)

        });
    }

    public get offset() {
        return 0;
    }

    public async loadNext() {

    }

    public async loadPrevious() {

    }
}