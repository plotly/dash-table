import { IPaginator } from 'dash-table/derived/paginator';

export interface IPageNavigationProps {
    paginator: IPaginator;
    page_current: number;
}
