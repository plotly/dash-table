import * as R from 'ramda';
import React, { Component } from 'react';

import RealTable from 'dash-table/components/Table';

import Logger from 'core/Logger';

import genRandomId from 'dash-table/utils/generate';
import isValidProps from './validate';
import Sanitizer from './Sanitizer';
import { defaultProps, propTypes } from 'dash-table/dash/DataTable';

/**
 * Dash DataTable is an interactive table component designed for
 * designed for viewing, editing, and exploring large datasets.
 * DataTable is rendered with standard, semantic HTML <table/> markup,
 * which makes it accessible, responsive, and easy to style. This
 * component was written from scratch in React.js specifically for the
 * Dash community. Its API was designed to be ergonomic and its behavior
 * is completely customizable through its properties.
 */
export default class DataTable extends Component {
    constructor(props) {
        super(props);
        let id;
        this.getId = () => (id = id || genRandomId('table-'));
        this.sanitizer = new Sanitizer();
    }

    render() {
        if (!isValidProps(this.props)) {
            return (<div>Invalid props combination</div>);
        }

        const sanitizedProps = this.sanitizer.sanitize(this.props);
        return this.props.id ?
            (<RealTable {...sanitizedProps} />) :
            (<RealTable {...sanitizedProps} id={this.getId()} />);
    }
}

DataTable.defaultProps = defaultProps;
DataTable.propTypes = propTypes;
