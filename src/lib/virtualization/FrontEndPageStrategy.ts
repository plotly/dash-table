import * as R from 'ramda';

import AbstractStrategy, { Dataframe, ITarget } from './AbstractStrategy';

interface IFrontEndPageOptions {
    currentPage: number;
    pageSize: number;
}

export default class FrontEndPageStrategy extends AbstractStrategy<IFrontEndPageOptions> {
    private firstIndex: number;
    private lastIndex: number;

    constructor(target: ITarget<IFrontEndPageOptions>) {
        super(target);

        this.loadPage(this.settings.options.currentPage);
    }

    protected refresh() {
        if (this.currentPage === this.settings.options.currentPage) {
            return;
        }

        this.loadPage(this.settings.options.currentPage);
    }

    private update() {
        let page = this.dataframe.slice(
            this.firstIndex,
            this.lastIndex
        );

        this.target.update({
            dataframe: page,
            viewportDataframe: page,
            viewportIndices: R.range(this.firstIndex, this.lastIndex)
        });

        if (this.currentPage !== this.settings.options.currentPage) {
            this.settings.options.currentPage = this.currentPage;
            this.target.update({
                settings: this.settings
            });
        }
    }

    public get currentPage() {
        return this.firstIndex / this.settings.options.pageSize;
    }

    public get offset() {
        return this.firstIndex;
    }

    public async loadNext() {
        if (this.dataframe.length - this.lastIndex <= 0) {
            return;
        }

        this.firstIndex = this.lastIndex;
        this.lastIndex = Math.min(
            this.lastIndex + this.settings.options.pageSize,
            this.dataframe.length
        );

        this.update();
    }

    public async loadPrevious() {
        if (this.firstIndex === 0) {
            return;
        }

        this.lastIndex = this.firstIndex;
        this.firstIndex = Math.max(
            0,
            this.firstIndex - this.settings.options.pageSize
        );

        this.update();
    }

    protected loadPage(page: number) {
        let maxPage = Math.min(
            page,
            Math.floor(this.dataframe.length / this.settings.options.pageSize)
        );

        this.firstIndex = this.settings.options.pageSize * maxPage;

        this.lastIndex = Math.min(
            this.firstIndex + this.settings.options.pageSize,
            this.dataframe.length
        );

        this.update();
    }
}