import React, { Component } from 'react';
import * as R from 'ramda';

import { memoizeOne } from 'core/memoizer';

import PaginatorFactory from 'dash-table/pagination/PaginatorFactory';

import ControlledTable from 'dash-table/components/ControlledTable';
import { PropsWithDefaults, SetProps } from './props';
import VirtualDataframeAdapter from 'dash-table/components/Table/VirtualDataframeAdapter';

import 'react-select/dist/react-select.css';
import './Table.less';
import './Dropdown.css';

export default class Table extends Component<PropsWithDefaults> {
    constructor(props: any) {
        super(props);
    }

    public get setProps() {
        return this.__setProps(this.props.setProps);
    }

    render() {
        const { setProps, paginator } = this;

        paginator.refresh();

        return (<ControlledTable
            {...R.mergeAll([
                this.props,
                this.state,
                { setProps, paginator }
            ])}
        />);
    }

    private get adapter() {
        return this.__adapter();
    }

    private get paginator() {
        const { pagination_mode, pagination_settings } = this.props;

        return this.__paginator(
            pagination_mode,
            pagination_settings
        );
    }

    private __adapter = memoizeOne(
        () => new VirtualDataframeAdapter(this)
    );

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

    private __paginator = memoizeOne((_pageMode, _settings) => {
        return PaginatorFactory.getPaginator(this.adapter);
    });
}