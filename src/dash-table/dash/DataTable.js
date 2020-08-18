import * as R from 'ramda';
import React, {Component, Suspense} from 'react';
import {asyncDecorator} from '@plotly/dash-component-plugins';

import LazyLoader from 'dash-table/LazyLoader';

/**
 * Dash DataTable is an interactive table component designed for
 * designed for viewing, editing, and exploring large datasets.
 * DataTable is rendered with standard, semantic HTML <table/> markup,
 * which makes it accessible, responsive, and easy to style. This
 * component was written from scratch in React.js specifically for the
 * Dash community. Its API was designed to be ergonomic and its behavior
 * is completely customizable through its properties.
 */
const DataTable = props => (
    <Suspense fallback={null}>
        <RealDataTable {...props} />
    </Suspense>
);

export default DataTable;

const RealDataTable = asyncDecorator(DataTable, LazyLoader.table, true);

DataTable.persistenceTransforms = {
    columns: {
        name: {
            extract: propValue => R.pluck('name', propValue),
            apply: (storedValue, propValue) =>
                R.zipWith(R.assoc('name'), storedValue, propValue)
        }
    }
};
