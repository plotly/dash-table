import React, {
    PureComponent
} from 'react';
import { Remarkable } from 'remarkable';

import { memoizeOne } from 'core/memoizer';

interface IProps {
    active: boolean;
    applyFocus: boolean;
    className: string;
    value: any;
}

export default class CellMarkdown extends PureComponent<IProps> {
    private static md: Remarkable = new Remarkable();

    getMarkdown = memoizeOne((value: string) => ({
        dangerouslySetInnerHTML: {
            __html: CellMarkdown.md.render(value)
        }
    }));

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
            {...this.getMarkdown(value)}
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
