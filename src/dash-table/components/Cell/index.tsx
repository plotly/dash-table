import React, {
    Component
} from 'react';

import { isEqual } from 'core/comparer';

import {
    ICellProps,
    ICellPropsWithDefaults,
    ICellState
} from 'dash-table/components/Cell/props';

export default class Cell extends Component<ICellProps, ICellState> {
    constructor(props: ICellProps) {
        super(props);
    }

    private get propsWithDefaults(): ICellPropsWithDefaults {
        return this.props as ICellPropsWithDefaults;
    }

    render() {
        const { classes, property, style } = this.propsWithDefaults;

        return (<td
            ref='td'
            children={(this as any).props.children}
            tabIndex={-1}
            className={classes}
            style={style}
            data-dash-column={property}
        />);
    }

    shouldComponentUpdate(nextProps: ICellPropsWithDefaults, nextState: ICellState) {
        const props = this.props;
        const state = this.state;

        return !isEqual(props, nextProps, true) ||
            !isEqual(state, nextState, true);
    }
}