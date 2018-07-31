import React from 'react';
import AbstractStrategy, { IVirtualTable, IVirtualizationOptions } from './AbstractStrategy';

interface INoneOptions extends IVirtualizationOptions {
    type: 'none';
    options: undefined;
}

export default class NoStrategy extends AbstractStrategy<INoneOptions> {
    constructor(target: IVirtualTable) {
        super(target);

        this.refresh();
    }

    public refresh() {
        this.target.setState({
            dataframe: this.dataframe
        });
    }

    public get offset() {
        return 0;
    }

    public async loadNext() {

    }

    public async loadPrevious() {

    }
}