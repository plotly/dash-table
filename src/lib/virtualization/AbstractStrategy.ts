export type Dataframe = any[];

export interface IVirtualizationOptions {
    type: string;
    subType?: string;
    options: any;
}
export interface IVirtualTableProps {
    dataframe: Dataframe;
    virtualization: IVirtualizationOptions;
}

export interface IVirtualTableState {
    dataframe: Dataframe;
}

export interface IVirtualTable {
    setState: (state: Partial<IVirtualTableState>) => {};

    props: IVirtualTableProps & {
        setProps: (props: Partial<IVirtualTableProps>) => {};
    };
    state: IVirtualTableState;
}

export default abstract class AbstractVirtualizationStrategy
    <TVirtualizationOptions extends IVirtualizationOptions>
{
    private __dataframe: Dataframe;
    private __virtualization: TVirtualizationOptions;

    constructor(protected readonly target: IVirtualTable) {
        this.onNextProps(target.props);
    }

    public get isNull(): boolean {
        return false;
    }

    public onNextProps(nextProps: any) {
        this.__dataframe = nextProps.dataframe;
        this.__virtualization = nextProps.virtualization;

        this.refresh();
    }

    protected get dataframe(): Dataframe {
        return this.__dataframe;
    }

    protected get virtualization(): TVirtualizationOptions {
        return this.__virtualization;
    }

    // Abstract
    public abstract get offset(): number;

    public abstract loadNext(): Promise<void>;
    public abstract loadPrevious(): Promise<void>;

    protected abstract refresh(): void;
}