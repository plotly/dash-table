import React from 'react';
import AbstractStrategy, { Dataframe } from './AbstractStrategy';

export default class NoStrategy extends AbstractStrategy<object> {
    constructor(
        table: any,
        dataframe: Dataframe
    ) {
        super(table, dataframe, {});

        this.update();
    }

    protected update() {
        this.table.setState({
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