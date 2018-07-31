import AbstractStrategy, { Dataframe, IVirtualTable, IVirtualizationOptions } from './AbstractStrategy';

interface IFrontPageOptions extends IVirtualizationOptions {
    type: 'fe_page';
    options: {
        currentPage: number;
        pageSize: number;
    };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype
// Mutator Methods
const ARRAY_MUTATORS: ReadonlyArray<string> = Object.freeze([
    'copyWithin',
    'fill',
    'pop',
    'push',
    'reverse',
    'shift',
    'sort',
    'splice',
    'unshift'
]);

export default class FrontEndPageStrategy extends AbstractStrategy<IFrontPageOptions> {
    private firstIndex: number;
    private lastIndex: number;
    private proxy: Dataframe;

    constructor(target: IVirtualTable) {
        super(target);

        this.loadPage(this.options.currentPage);
    }

    protected refresh() {
        if (this.currentPage === this.options.currentPage) {
            return;
        }

        this.loadPage(this.options.currentPage);
    }

    private update() {
        let page = this.dataframe.slice(
            this.firstIndex,
            this.lastIndex
        );

        // proxy page for ops
        if (this.proxy) {
            delete this.proxy;
        }

        this.proxy = new Proxy<Dataframe>(page, {
            get: (target: any, key: string) => {
                if (!ARRAY_MUTATORS.includes(key)) {
                    return target[key];
                }

                return (...args: any[]) => {
                    let res = target[key].apply(target, args);

                    // swap out the old page-array for the modified one
                    // in the full dataframe -- keep both in sync
                    this.dataframe.splice(
                        this.firstIndex,
                        this.lastIndex - this.firstIndex,
                        ...target
                    );

                    return res;
                };
            }
        });

        this.target.setState({
            dataframe: this.proxy
        });

        if (this.currentPage !== this.options.currentPage) {
            this.options.currentPage = this.currentPage;
            this.target.props.setProps({
                virtualization: this.virtualization
            });
        }
    }

    public get currentPage() {
        return this.firstIndex / this.options.pageSize;
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
            this.lastIndex + this.options.pageSize,
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
            this.firstIndex - this.options.pageSize
        );

        this.update();
    }

    protected loadPage(page: number) {
        let maxPage = Math.min(
            page,
            Math.floor(this.dataframe.length / this.options.pageSize)
        );

        this.firstIndex = this.options.pageSize * maxPage;

        this.lastIndex = Math.min(
            this.firstIndex + this.options.pageSize,
            this.dataframe.length
        );

        this.update();
    }

    private get options() {
        return this.virtualization.options;
    }
}