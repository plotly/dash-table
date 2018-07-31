import AbstractVirtualizationStrategy, { IVirtualTable, IVirtualizationOptions } from './AbstractStrategy';

interface ILegacyOptions extends IVirtualizationOptions {
    type: 'legacy';
    options: undefined;
}

export default class LegacyStrategy extends AbstractVirtualizationStrategy<ILegacyOptions> {
    constructor(target: IVirtualTable) {
        super(target);
    }

    public get isNull(): boolean {
        return true;
    }

    public get offset() {
        return 0;
    }

    public refresh() {

    }

    public async loadNext() {

    }

    public async loadPrevious() {

    }
}