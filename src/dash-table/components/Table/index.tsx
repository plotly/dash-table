import React, { Component } from 'react';
import * as R from 'ramda';

import { memoizeOne } from 'core/memoizer';

import ControlledTable from 'dash-table/components/ControlledTable';

import PaginationAdapter from 'dash-table/adapter/PaginationAdapter';
import ViewportDataframeAdapter from 'dash-table/adapter/ViewportDataframeAdapter';
import VirtualDataframeAdapter from 'dash-table/adapter/VirtualDataframeAdapter';

import { SetProps, PropsWithDefaultsAndDerived } from './props';
import 'react-select/dist/react-select.css';
import './Table.less';
import './Dropdown.css';

export default class Table extends Component<PropsWithDefaultsAndDerived> {
    private virtualAdapter: VirtualDataframeAdapter;
    private viewportAdapter: ViewportDataframeAdapter;
    private paginationAdapter: PaginationAdapter;

    constructor(props: any) {
        super(props);

        this.virtualAdapter = new VirtualDataframeAdapter(() => this.props);
        this.viewportAdapter = new ViewportDataframeAdapter(
            () => this.props,
            () => this.virtualAdapter.get().result
        );
        this.paginationAdapter = new PaginationAdapter(
            () => this.props,
            () => this.virtualAdapter.get().result,
            this.setProps
        );
    }

    public get setProps() {
        return this.__setProps(this.props.setProps);
    }

    render() {
        const { setProps } = this;

        const virtual = this.virtualAdapter.get();
        const viewport = this.viewportAdapter.get();
        const paginator = this.paginationAdapter.get();

        if (!virtual.cached || !viewport.cached) {
            let newProps: any = {};

            if (!virtual.cached) {
                newProps.derived_virtual_dataframe = virtual.result.virtual_dataframe;
                newProps.derived_virtual_indices = virtual.result.virtual_indices;
            }

            if (!viewport.cached) {
                newProps.derived_viewport_dataframe = viewport.result.viewport_dataframe;
                newProps.derived_viewport_indices = viewport.result.viewport_indices;
            }

            setTimeout(() => setProps(newProps), 0);
        }

        return (<ControlledTable
            {...R.mergeAll([
                this.props,
                this.state,
                virtual.result,
                viewport.result,
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
        } : (newProps: Partial<PropsWithDefaultsAndDerived>) => this.setState(newProps);
    });
}