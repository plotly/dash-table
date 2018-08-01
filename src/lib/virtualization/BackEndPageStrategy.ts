import * as R from 'ramda';

import AbstractStrategy, { Dataframe, ITarget } from './AbstractStrategy';

interface IBackEndPageOptions {
    currentPage: number;
    pageSize: number;
}

export default class BackEndPageStrategy extends AbstractStrategy<IBackEndPageOptions> {
    constructor(target: ITarget<IBackEndPageOptions>) {
        super(target);

        this.loadPage(this.settings.options.currentPage);
    }

    protected refresh() {
        this.target.update({
            dataframe: this.dataframe,
            viewportDataframe: this.dataframe,
            viewportIndices: R.range(0, this.dataframe.length)

        });
    }

    private update() {
        this.target.update({
            settings: this.settings
        });
    }

    public get currentPage() {
        return this.settings.options.currentPage;
    }

    public get offset() {
        return 0;
    }

    public async loadNext() {
        this.settings.options.currentPage++;
        this.update();
    }

    public async loadPrevious() {
        if (this.settings.options.currentPage > 0) {
            this.settings.options.currentPage--;
            this.update();
        }
    }

    protected loadPage(page: number) {
        if (this.settings.options.currentPage !== page) {
            this.settings.options.currentPage = page;
            this.update();
        }
    }
}