import AbstractStrategy, { Dataframe, ITarget } from './AbstractStrategy';

interface IBackEndPageOptions {
    currentPage: number;
    pageSize: number;
}

export default class BackEndPageStrategy extends AbstractStrategy<IBackEndPageOptions> {
    constructor(target: ITarget<IBackEndPageOptions>) {
        super(target);

        this.loadPage(this.options.currentPage);
    }

    protected refresh() {
        this.target.update({
            dataframe: this.dataframe
        });
    }

    private update() {
        this.target.update({
            settings: this.settings
        });
    }

    public get currentPage() {
        return this.options.currentPage;
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

    private get options() {
        return this.settings.options;
    }
}