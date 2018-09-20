import { PropsWithDefaults, SetProps } from 'dash-table/components/Table/props';

export default abstract class AbstractPaginationStrategy
{
    protected get mode() {
        return this.propsFn().pagination_mode;
    }

    protected get settings() {
        return this.propsFn().pagination_settings;
    }

    constructor(
        private readonly propsFn: () => PropsWithDefaults,
        protected readonly setProps: SetProps
    ) {

    }

    public abstract loadNext(): void;
    public abstract loadPrevious(): void;
}