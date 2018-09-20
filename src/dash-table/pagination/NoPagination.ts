import AbstractStrategy from 'dash-table/pagination/AbstractStrategy';
import { PropsWithDefaults, SetProps } from 'dash-table/components/Table/props';

export default class NoPaginationStrategy extends AbstractStrategy {
    constructor(propsFn: () => PropsWithDefaults, setProps: SetProps) {
        super(propsFn, setProps);
    }

    public loadNext() {

    }

    public loadPrevious() {

    }
}