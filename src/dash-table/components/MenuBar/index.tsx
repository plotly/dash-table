import React, { PureComponent } from 'react';

import './style.less';
import { IColumn } from '../Table/props';

interface IProps {
    columns: IColumn[];
    hiddenColumns?: string[];
    toggleColumn: (c: IColumn) => void;
    toggleRowOps: () => void;
    toggleColumnOps: () => void;
    opt?: string;
}

type Active = 'show/hide' | 'export' | 'manage';

interface IState {
    active?: Active;
}

export default class MenuBar extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {

        };
    }

    render = () => (<div
        className='menu-bar'
    >
        <div className='menu-bar-item menu-bar-item--export'>
            <div className='menu-bar-item-label' onClick={this.toggleExport}>Export</div>
            {this.state.active === 'export' ?
                <div className='menu-bar-submenu'>
                    <div className='menu-bar-submenu-item'>
                        <label>Export as CSV...</label>
                    </div>
                    <div className='menu-bar-submenu-item'>
                        <label>Export as XLSX...</label>
                    </div>
                </div> : null}
        </div>
        <div className='menu-bar-item menu-bar-item--showhide'>
            <div className='menu-bar-item-label' onClick={this.toggleShowHide}>Show/Hide</div>
            {this.state.active === 'show/hide' ?
                <div className='menu-bar-submenu'>
                    {this.props.columns.map(column => (<div
                        className='menu-bar-submenu-item'
                        onClick={this.props.toggleColumn.bind(undefined, column)}
                        style={{ display: 'flex', flexDirection: 'row' }}
                    >
                        <input
                            type='checkbox'
                            checked={!this.props.hiddenColumns || this.props.hiddenColumns.indexOf(column.id) < 0}
                        />
                        <label>{column.name || column.id}</label>
                    </div>))}
                </div> : null}
        </div>
        <div className='menu-bar-item menu-bar-item--manage'>
            <div className='menu-bar-item-label' onClick={this.toggleManage}>Manage</div>
            {this.state.active === 'manage' ?
                <div className='menu-bar-submenu'>
                    <div className='menu-bar-submenu-item'>
                        <label>Toggle row ops</label>
                    </div>
                    <div className='menu-bar-submenu-item'>
                        <label>Toggle column ops</label>
                    </div>
                </div> : null}
        </div>
    </div>)

    private toggle = (active: Active) => this.setState(
        prevState => prevState.active === active ?
            { active: undefined } :
            { active: active }
    )

    private toggleExport = this.toggle.bind(this, 'export');
    private toggleManage = this.toggle.bind(this, 'manage');
    private toggleShowHide = this.toggle.bind(this, 'show/hide');
}

// export default React.memo((_props: IProps, _state: IState) => (<div
//     className='menu-bar'
// >
//     <div className='menu-bar-item'>Export</div>
//     <div className='menu-bar-item'>Show/Hide</div>
//     <div className='menu-bar-item'>Manage</div>
// </div>));