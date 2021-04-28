import React, {memo} from 'react';

import {FilterCase} from 'dash-table/components/Table/props';

interface IFilterCaseButtonProps {
    filterOptions: FilterCase;
    toggleFilterOptions: () => void;
}

export default memo(
    ({filterOptions, toggleFilterOptions}: IFilterCaseButtonProps) => (
        <input
            type='button'
            className={`dash-filter--case ${
                filterOptions === FilterCase.Insensitive
                    ? 'dash-filter--case--sensitive'
                    : 'dash-filter--case--insensitive'
            }`}
            onClick={toggleFilterOptions}
            value='Aa'
        />
    )
);
