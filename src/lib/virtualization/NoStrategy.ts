import AbstractStrategy, { Dataframe } from './AbstractStrategy';

export default class NoStrategy extends AbstractStrategy {
    constructor(
        table: any,
        dataframe: Dataframe,
        options: any
    ) {
        super(table, dataframe, options);
    }

    protected update() {

    }

    public loadNext() {
        return Promise.resolve();
    }

    public loadPrevious() {
        return Promise.resolve();
    }
}