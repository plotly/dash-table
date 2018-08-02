import * as R from 'ramda';

import AbstractStrategy, { ITarget } from 'dash-table/virtualization/AbstractStrategy';

export default class FrontEndPageStrategy extends AbstractStrategy {
    private firstIndex: number;
    private lastIndex: number;

    constructor(target: ITarget) {
        super(target);
    }

    protected getDataframe() {
        let { settings, dataframe } = this.target;
        console.log('getDataframe', settings);

        let currentPage = Math.min(
            settings.currentPage,
            Math.floor(dataframe.length / settings.pageSize)
        );

        this.firstIndex = settings.pageSize * currentPage;

        this.lastIndex = Math.min(
            this.firstIndex + settings.displayedPages * settings.pageSize,
            dataframe.length
        );

        return {
            dataframe: dataframe.slice(
                this.firstIndex,
                this.lastIndex
            ),
            indices: R.range(this.firstIndex, this.lastIndex)
        };
    }

    public get offset() {
        return this.firstIndex;
    }

    public loadNext() {
        let { settings, dataframe } = this.target;

        let maxPageIndex = Math.floor(dataframe.length / settings.pageSize);

        if (settings.currentPage >= maxPageIndex) {
            return;
        }

        settings.currentPage++;
        console.log('loadNext', settings);
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