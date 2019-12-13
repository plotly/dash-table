import React, {
    PureComponent
} from 'react';

import { memoizeOne } from 'core/memoizer';

import Highlight from 'dash-table/components/Highlight';

interface IProps {
    active: boolean;
    applyFocus: boolean;
    className: string;
    value: any;
}

export default class CellMarkdown extends PureComponent<IProps, {}> {

    getMarkdown = memoizeOne((value: string, _ready: any) => ({
        dangerouslySetInnerHTML: {
            __html: Highlight.mdHtml(String(value))
        }
    }));

    constructor(props: IProps) {
        super(props);

        if (Highlight.isReady !== true) {
            Highlight.isReady.then(() => { this.setState({}); });
        }
    }

    componentDidUpdate() {
        this.setFocus();
    }

    componentDidMount() {
        this.setFocus();
    }

    render() {
        const {
            className,
            value
        } = this.props;

        return (<div
            ref='el'
            tabIndex={-1}
            className={[className, 'cell-markdown'].join(' ')}
            {...this.getMarkdown(value, Highlight.isReady)}
        />);
    }

    private setFocus() {
        const { active, applyFocus } = this.props;
        if (!active) {
            return;
        }

        const el = this.refs.el as HTMLDivElement;

        if (applyFocus && el && document.activeElement !== el) {
            el.focus();
        }
    }

}
