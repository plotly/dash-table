import React, { PureComponent } from 'react';

import { Case } from 'dash-table/components/Table/props';

interface IFilterCaseButtonProps {
    filterCase: Case;
    setColumnCase: () => void;
}

export default class FilterCaseButton extends PureComponent<IFilterCaseButtonProps> {
    render() {
        const filterCaseClass: string = (this.props.filterCase !== Case.Insensitive) ?
                'dash-filter--case--sensitive' : 'dash-filter--case--insensitive';

        return (<input
            type='button'
            className={'dash-filter--case ' + filterCaseClass}
            onClick={this.props.setColumnCase}
            value='Aa'
        />);
    }
}