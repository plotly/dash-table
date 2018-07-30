import AbstractStrategy, { Dataframe } from './AbstractStrategy';

export default class FrontEndPageStrategy extends AbstractStrategy {
    private firstIndex: number = 0;
    private lastIndex: number = 0;

    constructor(
        table: any,
        dataframe: Dataframe,
        options: any
    ) {
        super(table, dataframe, options);

        this.lastIndex = Math.min(options.pageSize, dataframe.length);
        this.update();
    }

    private setState() {
        const { data } = this.table.state;

        this.table.setState({
            data: data
        });
    }

    protected update() {
        this.setState();
    }

    public loadNext() {
        console.log('loadNext');
        return Promise.resolve();
    }

    public loadPrevious() {
        console.log('loadPrevious');
        return Promise.resolve();
    }
}