import * as R from 'ramda';

import AbstractStrategy, { ITarget } from 'dash-table/virtualization/AbstractStrategy';

export default class BackEndPageStrategy extends AbstractStrategy {
    constructor(target: ITarget) {
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

        settings.currentPage++;
        this.target.update({ settings });
    }

    public loadPrevious() {
        let { settings } = this.target;

        if (settings.currentPage <= 0) {
            return;
        }

        settings.currentPage--;
        this.target.update({ settings });
    }
}