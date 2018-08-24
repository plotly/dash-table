import * as R from 'ramda';
import Dropdown from 'react-select';
import React, {
    ChangeEvent,
    ClipboardEvent,
    Component,
    CSSProperties,
    MouseEvent
} from 'react';

import { isEqual } from 'core/comparer';
import memoizerCache from 'core/memoizerCache';
import SyntaxTree from 'core/syntax-tree';
import { memoizeOne } from 'core/memoizer';

interface IDropdownOption {
    label: string;
    value: string;
}

type IDropdownOptions = IDropdownOption[];

interface IConditionalDropdown {
    condition: string;
    dropdown: IDropdownOptions;
}

interface IStyle {
    target?: undefined;
    style: CSSProperties;
}

interface IConditionalStyle extends IStyle {
    condition: string;
}

interface IProps {
    active: boolean;
    classes?: string[];
    clearable: boolean;
    conditionalDropdowns?: IConditionalDropdown[];
    conditionalStyles?: IConditionalStyle[];
    datum: any;
    editable: boolean;
    focused: boolean;
    onChange: (e: ChangeEvent) => void;
    onClick: (e: MouseEvent) => void;
    onDoubleClick: (e: MouseEvent) => void;
    onPaste: (e: ClipboardEvent) => void;
    property: string | number;
    selected: boolean;
    staticDropdown?: IDropdownOptions;
    staticStyle?: IStyle;
    tableId: string;
    type?: string;
    value: any;
}

interface IDefaultProps {
    classes: string[];
    conditionalDropdowns: IConditionalDropdown[];
    conditionalStyles: IConditionalStyle[];
    staticStyle: CSSProperties;
    type: string;
}

interface IState {
    value: any;
}

type IPropsWithDefaults = IProps & IDefaultProps;

const dropdownAstCache = memoizerCache<[string, string | number, number], [string], SyntaxTree>(
    (query: string) => new SyntaxTree(query)
);

const styleAstCache = memoizerCache<[string, string | number, number], [string], SyntaxTree>(
    (query: string) => new SyntaxTree(query)
);

export default class Cell extends Component<IProps, IState> {
    public static defaultProps: IDefaultProps = {
        classes: [],
        conditionalDropdowns: [],
        conditionalStyles: [],
        staticStyle: {},
        type: 'text'
    };

    constructor(props: IProps) {
        super(props);

        this.state = {
            value: props.value
        };
    }

    get classes(): string[] {
        let {
            active,
            classes,
            editable,
            selected,
            type
        } = this.propsWithDefaults;

        return [
            ...(active ? ['focused'] : []),
            ...(!editable ? ['cell--uneditable'] : []),
            ...(selected ? ['cell--selected'] : []),
            ...(type === 'dropdown' ? ['dropdown'] : []),
            ...classes
        ];
    }

    get propsWithDefaults(): IPropsWithDefaults {
        return this.props as IPropsWithDefaults;
    }

    private renderDropdown() {
        const {
            clearable,
            onChange,
            value
        } = this.propsWithDefaults;

        const dropdown = this.dropdown;

        return !dropdown ?
            this.renderValue() :
            (<Dropdown
                ref='dropdown'
                clearable={clearable}
                onChange={(newValue: any) => {
                    onChange(newValue ? newValue.value : newValue);
                }}
                onOpen={this.handleOpenDropdown}
                options={dropdown}
                placeholder={''}
                value={value}
            />);
    }

    private onPaste = (e: React.ClipboardEvent<Element>) => {
        const { onPaste } = this.propsWithDefaults;

        onPaste(e);
        e.stopPropagation();
    }

    private renderInput() {
        const {
            active,
            focused,
            onClick,
            onDoubleClick
        } = this.propsWithDefaults;

        const classes = [
            ...(active ? ['input-active'] : []),
            ...(focused ? ['focused'] : ['unfocused']),
            ...['cell-value']
        ];

        const attributes = {
            className: classes.join(' '),
            onClick: onClick,
            onDoubleClick: onDoubleClick
        };

        return !active ?
            this.renderValue(attributes) :
            (<input
                ref='textInput'
                type='text'
                value={this.state.value}
                onChange={this.handleChange}
                onPaste={this.onPaste}
                {...attributes}
            />);
    }

    private renderValue(attributes = {}) {
        const { value } = this.propsWithDefaults;

        return (<div
            {...attributes}
        >
            {value}
        </div>);
    }

    private renderInner() {
        const {
            type
        } = this.props;

        switch (type) {
            case 'text':
            case 'numeric':
                return this.renderInput();
            case 'dropdown':
                return this.renderDropdown();
            default:
                return this.renderValue();
        }
    }

    private getDropdown = memoizeOne((...dropdowns: IDropdownOptions[]): IDropdownOptions | undefined => {
        return dropdowns.length ? dropdowns.slice(-1)[0] : undefined;
    });

    private get dropdown() {
        let {
            conditionalDropdowns,
            datum,
            property,
            staticDropdown,
            tableId
        } = this.propsWithDefaults;

        const dropdowns = [
            ...(staticDropdown ? [staticDropdown] : []),
            ...R.map(
                ([cd]) => cd.dropdown,
                R.filter(
                    ([cd, i]) => dropdownAstCache([tableId, property, i], [cd.condition]).evaluate(datum),
                    R.addIndex<IConditionalDropdown, [IConditionalDropdown, number]>(R.map)(
                        (cd, i) => [cd, i],
                        conditionalDropdowns
                    ))
            )
        ];

        return this.getDropdown(...dropdowns);
    }

    private getStyle = memoizeOne((...styles: CSSProperties[]) => {
        return styles.length ? R.mergeAll<CSSProperties>(styles) : undefined;
    });

    private get style() {
        let {
            conditionalStyles,
            datum,
            property,
            staticStyle,
            tableId
        } = this.propsWithDefaults;

        const styles = [staticStyle, ...R.map(
            ([cs]) => cs.style,
            R.filter(
                ([cs, i]) => styleAstCache([tableId, property, i], [cs.condition]).evaluate(datum),
                R.addIndex<IConditionalStyle, [IConditionalStyle, number]>(R.map)(
                    (cs, i) => [cs, i],
                    conditionalStyles
                )
            )
        )];

        return this.getStyle(...styles);
    }

    shouldComponentUpdate(nextProps: IPropsWithDefaults, nextState: IState) {
        const props = this.props;
        const state = this.state;

        return !isEqual(props, nextProps, true) ||
            !isEqual(state, nextState, true);
    }

    render() {
        return (<td
            ref='td'
            tabIndex={-1}
            className={this.classes.join(' ')}
            style={this.style}
        >
            {this.renderInner()}
        </td>);
    }

    handleChange = (e: any) => {
        this.setState({ value: e.target.value });
    }

    handleOpenDropdown = () => {
        const { dropdown }: { [key: string]: any } = this.refs;

        const menu = dropdown.wrapper.querySelector('.Select-menu-outer');
        const parentBoundingRect = menu.parentElement.getBoundingClientRect();

        menu.style.width = `${parentBoundingRect.width}px`;
        menu.style.top = `${parentBoundingRect.y + parentBoundingRect.height}px`;
        menu.style.left = `${parentBoundingRect.x}px`;
        menu.style.position = 'fixed';
    }

    componentWillReceiveProps(nextProps: IPropsWithDefaults) {
        const { value } = this.props;
        const { value: nextValue } = nextProps;

        if (value !== nextValue) {
            this.setState({
                value: nextValue
            });
        }
    }

    componentDidUpdate() {
        const { active, onChange, value } = this.propsWithDefaults;

        if (active && this.refs.textInput) {
            (this.refs.textInput as HTMLElement).focus();
        }

        if (active && this.refs.dropdown) {
            (this.refs.td as HTMLElement).focus();
        }

        if (!active && this.state.value !==  value) {
            onChange({
                target: {
                    value: this.state.value
                }
            } as any);
        }
    }
}