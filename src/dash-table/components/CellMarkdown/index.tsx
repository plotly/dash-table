import React, {
    PureComponent
} from 'react';
import { Remarkable } from 'remarkable';

import { memoizeOne } from 'core/memoizer';

import LazyLoader from 'dash-table/LazyLoader';

interface IProps {
    active: boolean;
    applyFocus: boolean;
    className: string;
    value: any;
}

interface IState {
    hljsLoaded: any;
    hljsStylesLoaded: any;
}

let hljsResolve: () => any;
let hljsStylesResolve: () => any;

let hljsLoaded: Promise<boolean> | true = new Promise<boolean>(resolve => {
    hljsResolve = resolve;
});

let hljsStylesLoaded: Promise<boolean> | true = new Promise<boolean>(resolve => {
    hljsStylesResolve = resolve;
});

let hljs: any;
let hljsStyles: any;

export default class CellMarkdown extends PureComponent<IProps, IState> {

    private static readonly md: Remarkable = new Remarkable({
        highlight: (str: string, lang: string) => {
            if (hljs && hljsStyles) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, str).value;
                    } catch (err) { }
                }

                try {
                    return hljs.highlightAuto(str).value;
                } catch (err) { }
            } else {
                CellMarkdown.loadhljs();
            }
            return '';
        }
    });

    getMarkdown = memoizeOne((value: string, _hljsLoaded: any) => ({
        dangerouslySetInnerHTML: {
            __html: CellMarkdown.md.render(String(value))
        }
    }));

    private static async loadhljs() {
        hljs = await LazyLoader.hljs;
        hljsStyles = await LazyLoader.hljsStyles;
        hljsResolve();
        hljsStylesResolve();
        hljsLoaded = true;
        hljsStylesLoaded = true;
    }

    constructor(props: IProps) {
        super(props);
        this.state = { hljsLoaded, hljsStylesLoaded };

        // if doesn't equal true, assume it's a promise
        if (hljsLoaded !== true) {
            Promise.all([hljsLoaded, hljsStylesLoaded]).then(() => { this.setState({ hljsLoaded: true }); });
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
            {...this.getMarkdown(value, this.state.hljsLoaded)}
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
