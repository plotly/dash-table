import * as R from 'ramda';

export type Dataframe = any[];

export interface ISettings<TOptions> {
    type: string;
    subType?: string;
    options: TOptions;
}

export interface IViewport<TOptions> {
    readonly dataframe: Dataframe;
    readonly settings: ISettings<TOptions>;

    readonly viewportDataframe: Dataframe;
    readonly viewportIndices: number[];
}

export interface ITarget<TOptions> extends IViewport<TOptions> {
    update: (viewport: Partial<IViewport<TOptions>>) => void;
}

export default abstract class AbstractVirtualizationStrategy<TOptions>
{
    protected __dataframe: Dataframe;

    constructor(protected readonly target: ITarget<TOptions>) {

    }

    public get dataframe(): Dataframe {
        return this.__dataframe;
    }

    public refresh() {
        this.__dataframe = this.target.dataframe ?
            this.getDataframe() :
            [];

        // this.target.update({
        //     viewportDataframe: this.__dataframe,
        //     viewportIndices: R.range(0, this.__dataframe.length)
        // });
    }

    // Abstract
    public abstract get offset(): number;

    public abstract loadNext(): void;
    public abstract loadPrevious(): void;

    protected abstract getDataframe(): Dataframe;
}