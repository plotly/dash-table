import AbstractStrategy, { Dataframe, IVirtualTable, IVirtualizationOptions } from './AbstractStrategy';

interface IFrontPageOptions extends IVirtualizationOptions {
    type: 'be';
    subType: 'page';
    options: {
        currentPage: number;
        pageSize: number;
    };
}

export default class BackEndPageStrategy extends AbstractStrategy<IFrontPageOptions> {
    constructor(target: IVirtualTable) {
        super(target);

        this.loadPage(this.options.currentPage);
    }

    protected refresh() {
        this.target.setState({
            dataframe: this.dataframe
        });
    }

    private update() {
        this.target.props.setProps({
            dataframe: this.dataframe,
            virtualization: this.virtualization
        });
    }

    public get currentPage() {
        return this.options.currentPage;
    }

    public get offset() {
        return 0;
    }

    public async loadNext() {
        this.virtualization.options.currentPage++;
        this.update();
    }

    public async loadPrevious() {
        if (this.virtualization.options.currentPage > 0) {
            this.virtualization.options.currentPage--;
            this.update();
        }
    }

    protected loadPage(page: number) {
        if (this.virtualization.options.currentPage !== page) {
            this.virtualization.options.currentPage = page;
            this.update();
        }
    }

    private get options() {
        return this.virtualization.options;
    }
}