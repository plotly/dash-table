import React, { Component } from 'react';
import * as R from 'ramda';

import { memoizeOne } from 'core/memoizer';

import ControlledTable from 'dash-table/components/ControlledTable';
import { PropsWithDefaults, SetProps } from './props';
import VirtualDataframeAdapter from 'dash-table/dataframe/VirtualDataframeAdapter';

import 'react-select/dist/react-select.css';
import './Table.less';
import './Dropdown.css';
import ViewportDataframeAdapter from 'dash-table/dataframe/ViewportDataframeAdapter';
import PaginationAdapter from 'dash-table/dataframe/PaginationAdapter';

export default class Table extends Component<PropsWithDefaults> {
    private virtualAdapter: VirtualDataframeAdapter;
    private viewportAdapter: ViewportDataframeAdapter;
    private paginationAdapter: PaginationAdapter;

    constructor(props: any) {
        super(props);

        this.virtualAdapter = new VirtualDataframeAdapter(() => props);
        this.viewportAdapter = new ViewportDataframeAdapter(
            () => props,
            () => this.virtualAdapter.get().result
        );
        this.paginationAdapter = new PaginationAdapter(
            () => props,
            () => this.virtualAdapter.get().result,
            this.setProps
        );
    }

    public get setProps() {
        return this.__setProps(this.props.setProps);
    }

    render() {
        const { setProps } = this;

        const virtualDataframe = this.virtualAdapter.get();
        const viewportDataframe = this.viewportAdapter.get();
        const paginator = this.paginationAdapter.get();

        if (!virtualDataframe.cached || !viewportDataframe.cached) {
            let newProps: any = {};

            if (!virtualDataframe.cached) {
                newProps.derived_virtual_dataframe = virtualDataframe.result.virtual_dataframe;
                newProps.derived_virtual_indices = virtualDataframe.result.virtual_indices;
            }

            if (!viewportDataframe.cached) {
                newProps.derived_viewport_dataframe = viewportDataframe.result.viewport_dataframe;
                newProps.derived_viewport_indices = viewportDataframe.result.viewport_indices;
            }

            setTimeout(() => setProps(newProps), 0);
        }

        return (<ControlledTable
            {...R.mergeAll([
                this.props,
                this.state,
                virtualDataframe.result,
                viewportDataframe.result,
                { setProps, paginator }
            ])}
        />);
    }

    private __setProps = memoizeOne((setProps?: SetProps) => {
        return setProps ? (newProps: any) => {
            if (R.has('dataframe', newProps)) {
                const { dataframe } = this.props;

                newProps.dataframe_timestamp = Date.now();
                newProps.dataframe_previous = dataframe;
            }

            setProps(newProps);
        } : (newProps: Partial<PropsWithDefaults>) => this.setState(newProps);
    });
}