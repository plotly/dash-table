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
        let { dataframe = [], indices = [] } = this.target.dataframe && this.getDataframe();

        let isEqual =
            !!this.__dataframe &&
            dataframe.length === this.dataframe.length &&
            !!dataframe.every((datum, index) => datum === this.dataframe[index]);

        if (isEqual) {
            return;
        }

        this.__dataframe = dataframe;
        this.target.update({
            viewportDataframe: dataframe,
            viewportIndices: indices
        });
    }

    // Abstract
    public abstract get offset(): number;

    public abstract loadNext(): void;
    public abstract loadPrevious(): void;

    protected abstract getDataframe(): { dataframe: Dataframe, indices: number[] };
}