import { Remarkable } from 'remarkable';
import LazyLoader from 'dash-table/LazyLoader';

export default class Highlight {

    static isReady: Promise<boolean> | true = new Promise<boolean>(resolve => {
        Highlight.hljsResolve = resolve;
    });

    static mdHtml = (value: string) => {
        return Highlight.md.render(value);
    }

    private static hljsResolve: () => any;

    private static hljs: any;

    private static readonly md: Remarkable = new Remarkable({
        highlight: (str: string, lang: string) => {
            if (Highlight.hljs) {
                if (lang && Highlight.hljs.getLanguage(lang)) {
                    try {
                        return Highlight.hljs.highlight(lang, str).value;
                    } catch (err) { }
                }

                try {
                    return Highlight.hljs.highlightAuto(str).value;
                } catch (err) { }
            } else {
                Highlight.loadhljs();
            }
            return '';
        }
    });

    private static async loadhljs() {
        Highlight.hljs = await LazyLoader.hljs;
        Highlight.hljsResolve();
        Highlight.isReady = true;
    }
}
