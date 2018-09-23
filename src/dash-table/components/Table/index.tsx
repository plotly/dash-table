import React, { Component } from 'react';
import * as R from 'ramda';

import { memoizeOne, memoizeOneWithFlag } from 'core/memoizer';

import ControlledTable from 'dash-table/components/ControlledTable';

import derivedPaginator from 'dash-table/derived/paginator';
import derivedViewportDataframe from 'dash-table/derived/viewportDataframe';
import derivedVirtualDataframe from 'dash-table/derived/virtualDataframe';

import { SetProps, PropsWithDefaultsAndDerived } from './props';
import 'react-select/dist/react-select.css';
import './Table.less';
import './Dropdown.css';

export default class Table extends Component<PropsWithDefaultsAndDerived> {
    constructor(props: PropsWithDefaultsAndDerived) {
        super(props);
    }

    public get setProps() {
        return this.__setProps(this.props.setProps);
    }

    render = () => {
        const { setProps } = this;

        const {
            dataframe,
            filtering,
            filtering_settings,
            pagination_mode,
            pagination_settings,
            sorting,
            sorting_settings,
            sorting_treat_empty_string_as_none
        } = this.props;

        const virtual = this.virtual(
            dataframe,
            filtering,
            filtering_settings,
            sorting,
            sorting_settings,
            sorting_treat_empty_string_as_none
        );

        const viewport = this.viewport(
            pagination_mode,
            pagination_settings,
            virtual.dataframe,
            virtual.indices
        );

        const paginator = this.paginator(
            pagination_mode,
            pagination_settings,
            setProps,
            viewport.dataframe
        );

        const viewportCached = this.viewportCache(viewport).cached;
        const virtualCached = this.virtualCache(virtual).cached;

        if (!virtualCached || !viewportCached) {
            let newProps: any = {};

            if (!virtualCached) {
                newProps.derived_virtual_dataframe = virtual.dataframe;
                newProps.derived_virtual_indices = virtual.indices;
            }

            if (!viewportCached) {
                newProps.derived_viewport_dataframe = viewport.dataframe;
                newProps.derived_viewport_indices = viewport.indices;
            }

            setTimeout(() => setProps(newProps), 0);
        }

        return (<ControlledTable
            {...R.mergeAll([
                this.props,
                this.state,
                {
                    paginator,
                    setProps,
                    viewport,
                    virtual
                }
            ])}
        />);
    }

    private readonly paginator = derivedPaginator();
    private readonly viewport = derivedViewportDataframe();
    private readonly virtual = derivedVirtualDataframe();

    private readonly viewportCache = memoizeOneWithFlag(viewport => viewport);
    private readonly virtualCache = memoizeOneWithFlag(virtual => virtual);

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