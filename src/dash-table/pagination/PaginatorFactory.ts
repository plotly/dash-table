import { ITarget } from 'dash-table/pagination/AbstractStrategy';

import BackEndPaginiation from 'dash-table/pagination/BackEndPaginiation';
import FrontEndPagination from 'dash-table/pagination/FrontEndPagination';
import NoPagination from 'dash-table/pagination/NoPagination';

export default class PaginatorFactory {
    public static getPaginator(target: ITarget) {
        switch (target.pageMode) {
            case false:
                return new NoPagination(target);
            case true:
            case 'fe':
                return new FrontEndPagination(target);
            case 'be':
                return new BackEndPaginiation(target);
            default:
                throw new Error(`Unknown paging mode: '${target.pageMode}'`);
        }
    }
}