export type Dataframe = any[];

export default abstract class AbstractVirtualizationStrategy<TOptions extends object> {
    constructor(
        protected readonly table: any,
        protected dataframe: Dataframe,
        protected options: TOptions
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

    public abstract get offset(): number;

    public abstract loadNext(): Promise<void>;
    public abstract loadPrevious(): Promise<void>;

    protected abstract update(): void;
}