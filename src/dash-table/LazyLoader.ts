export default class LazyLoader {
    public static get dataTable() {
        return import(/* webpackChunkName: "dash-table", webpackMode: "$${{mode}}" */ 'dash-table/dash/LazyDataTable');
    }

    public static get xlsx() {
        return import(/* webpackChunkName: "export", webpackMode: "$${{mode}}" */ 'xlsx');
    }
}