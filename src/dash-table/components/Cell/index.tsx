import React, {
    Component
} from 'react';

import { isEqual } from 'core/comparer';

import {
    ICellProps,
    ICellPropsWithDefaults
} from 'dash-table/components/Cell/props';

export default class Cell extends Component<ICellProps> {
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

    shouldComponentUpdate(nextProps: ICellPropsWithDefaults) {
        return !isEqual(this.props, nextProps, true);
    }
}