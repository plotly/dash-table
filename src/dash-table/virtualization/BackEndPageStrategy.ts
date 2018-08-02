import * as R from 'ramda';

import AbstractStrategy, { ITarget } from './AbstractStrategy';

interface IBackEndPageOptions {
    currentPage: number;
    pageSize: number;
}

export default class BackEndPageStrategy extends AbstractStrategy<IBackEndPageOptions> {
    constructor(target: ITarget<IBackEndPageOptions>) {
        super(target);
    }

    protected getDataframe() {
        let { dataframe } = this.target;

        return { dataframe, indices: R.range(0, dataframe.length) };
    }

    public get offset() {
        return 0;
    }

    public loadNext() {
        let { settings } = this.target;

        settings.options.currentPage++;
        this.target.update({ settings });
    }

    public loadPrevious() {
        let { settings } = this.target;

        if (settings.options.currentPage <= 0) {
            return;
        }

        settings.options.currentPage--;
        this.target.update({ settings });
    }
}