export default class LazyLoader {
    public static get xlsx() {
        return import(/* webpackChunkName: "export", webpackMode: "$${{mode}}" */ 'xlsx');
    }

    public static get hljs() {
        return import(/* webpackChunkName: "highlight", webpackMode: "$${{mode}}" */ '../../third-party/highlight.pack');
    }

    public static get hljsStyles() {
        return import(/* webpackChunkName: "highlight-styles", webpackMode: "$${{mode}}" */ '../../third-party/styles/github.css');
    }

    public static table() {
        return import(/* webpackChunkName: "table", webpackMode: "$${{mode}}" */ 'dash-table/dash/fragments/DataTable');
    }
}
