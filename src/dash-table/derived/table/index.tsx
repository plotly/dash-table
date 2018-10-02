import { memoizeOneFactory } from 'core/memoizer';

import CellFactory from 'dash-table/components/CellFactory';
import FilterFactory from 'dash-table/components/FilterFactory';
import HeaderFactory from 'dash-table/components/HeaderFactory';
import { ControlledTableProps } from 'dash-table/components/Table/props';

function getter(
    cellFactory: CellFactory,
    filterFactory: FilterFactory,
    headerFactory: HeaderFactory
): JSX.Element[][] {
    const rows: JSX.Element[][] = [];

    rows.push(...headerFactory.createHeaders());
    rows.push(...filterFactory.createFilters());
    rows.push(...cellFactory.createCells());

    return rows;
}

function decorator(propsFn: () => ControlledTableProps): JSX.Element[][] {
    const handleSetFilter = (filtering_settings: string) => propsFn().setProps({ filtering_settings });

    const cellFactory = new CellFactory(propsFn);
    const filterFactory = new FilterFactory(() => {
        const {
            columns,
            filtering,
            filtering_settings,
            filtering_type,
            id,
            row_deletable,
            row_selectable
        } = propsFn();

        const fillerColumns =
            (row_deletable ? 1 : 0) +
            (row_selectable ? 1 : 0);


        return {
            columns: columns,
            fillerColumns,
            filtering: filtering,
            filtering_settings: filtering_settings,
            filtering_type: filtering_type,
            id: id,
            setFilter: handleSetFilter
        };
    });
    const headerFactory = new HeaderFactory(propsFn);

    return getter.bind(undefined, cellFactory, filterFactory, headerFactory);
}

export default memoizeOneFactory(decorator);