import * as R from 'ramda';

import AbstractStrategy, { ITarget } from './AbstractStrategy';

interface IFrontEndPageOptions {
    currentPage: number;
    pageSize: number;
}

export default class FrontEndPageStrategy extends AbstractStrategy<IFrontEndPageOptions> {
    private firstIndex: number;
    private lastIndex: number;

    constructor(target: ITarget<IFrontEndPageOptions>) {
        super(target);
    }

    protected getDataframe() {
        let { settings, dataframe } = this.target;

        let currentPage = Math.min(
            settings.options.currentPage,
            Math.floor(dataframe.length / settings.options.pageSize)
        );

        this.firstIndex = settings.options.pageSize * currentPage;

        this.lastIndex = Math.min(
            this.firstIndex + settings.options.pageSize,
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

        let maxPage = Math.floor(dataframe.length / settings.options.pageSize);

        if (settings.options.currentPage >= maxPage) {
            return;
        }

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