export type Dataframe = any[];

export default abstract class AbstractVirtualizationStrategy {
    constructor(
        protected readonly table: any,
        protected dataframe: Dataframe,
        protected options: any
    ) {

    }

    public setDataframe(dataframe: Dataframe): void {
        this.dataframe = dataframe;
        this.update();
    }
    public setOptions(options: any): void {
        this.options = options;
        this.update();
    }

    protected abstract update(): void;

    public abstract loadNext(): Promise<void>;
    public abstract loadPrevious(): Promise<void>;
}