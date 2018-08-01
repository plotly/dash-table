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
    onUpdate: (callback: (nextProps: IViewport<TOptions>) => void) => (() => void);
}

export default abstract class AbstractVirtualizationStrategy<TOptions>
{
    private __dataframe: Dataframe;
    private __settings: ISettings<TOptions>;

    private listenerHandle: () => void;

    constructor(
        protected readonly target: ITarget<TOptions>
    ) {
        this.listenerHandle = this.target.onUpdate(this.onUpdate.bind(this));

        this.__dataframe = target.dataframe;
        this.__settings = target.settings;
        this.refresh();
    }

    destroy() {
        this.listenerHandle();
    }

    public onUpdate(viewport: IViewport<TOptions>) {
        if (this.__dataframe === viewport.dataframe && this.settings === viewport.settings) {
            return;
        }

        this.__dataframe = viewport.dataframe;
        this.__settings = viewport.settings;
        this.refresh();
    }

    protected get dataframe(): Dataframe {
        return this.__dataframe;
    }

    protected get settings(): ISettings<TOptions> {
        return this.__settings;
    }

    // Abstract
    public abstract get offset(): number;

    public abstract loadNext(): Promise<void>;
    public abstract loadPrevious(): Promise<void>;

    protected abstract refresh(): void;
}