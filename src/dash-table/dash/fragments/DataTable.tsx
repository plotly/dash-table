import React, { useRef } from 'react';

import RealTable from 'dash-table/components/Table';
import { PropsWithDefaults } from 'dash-table/components/Table/props';
import { propTypes, defaultProps } from '../DataTable';
import isValidProps from '../validate';
import Sanitizer from '../Sanitizer';


const DataTable = (props: PropsWithDefaults) => {
    const { current: sanitizer } = useRef<Sanitizer>(new Sanitizer());

    if (!isValidProps(props)) {
        return (<div>Invalid props combination</div>);
    }

    return (<RealTable {...sanitizer.sanitize(props) as any} />);
}

DataTable.defaultProps = defaultProps;
DataTable.propTypes = propTypes;

export default DataTable;