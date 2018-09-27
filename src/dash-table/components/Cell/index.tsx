import React, {
    Component
} from 'react';

import { isEqual } from 'core/comparer';
import memoizerCache from 'core/memoizerCache';
import SyntaxTree from 'core/syntax-tree';

import {
    ICellDefaultProps,
    ICellProps,
    ICellPropsWithDefaults,
    ICellState
} from 'dash-table/components/Cell/props';

import { ColumnId, ColumnType } from 'dash-table/components/Table/props';

export default class Cell extends Component<ICellProps, ICellState> {
    public static readonly dropdownAstCache = memoizerCache<[string, ColumnId, number], [string], SyntaxTree>(
        (query: string) => new SyntaxTree(query)
    );

    public static defaultProps: ICellDefaultProps = {
        type: ColumnType.Text
    };

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
            tabIndex={-1}
            className={classes}
            style={style}
            data-dash-column={property}
        >{(this.propsWithDefaults as any).children}</td>);
    }

    componentDidUpdate() {
        const { active } = this.propsWithDefaults;
        const input = this.refs.textInput as HTMLInputElement;

        if (active && input && document.activeElement !== input) {
            input.focus();
            input.setSelectionRange(0, input.value ? input.value.length : 0);
        }

        if (active && this.refs.dropdown) {
            (this.refs.td as HTMLElement).focus();
        }
    }

    shouldComponentUpdate(nextProps: ICellPropsWithDefaults, nextState: ICellState) {
        const props = this.props;
        const state = this.state;

        return !isEqual(props, nextProps, true) ||
            !isEqual(state, nextState, true);
    }
}