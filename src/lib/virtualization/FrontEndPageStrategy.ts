import AbstractStrategy, { Dataframe } from './AbstractStrategy';

interface IOptions {
    pageSize: number;
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

export default class FrontEndPageStrategy extends AbstractStrategy<IOptions> {
    private firstIndex: number;
    private lastIndex: number;
    private proxy: Dataframe;

    constructor(
        table: any,
        dataframe: Dataframe,
        options: IOptions
    ) {
        super(table, dataframe, options);

        this.firstIndex = 0;
        this.lastIndex = Math.min(options.pageSize, dataframe.length);

        this.update();
    }

    protected update() {
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

        this.table.setState({
            dataframe: this.proxy
        });
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
}