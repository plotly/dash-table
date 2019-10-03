import { memoizeOneFactory } from 'core/memoizer';

import { clearSelection } from 'dash-table/utils/actions';

import {
    Data,
    SetProps,
    TableAction
} from 'dash-table/components/Table/props';

export interface IPaginator {
    count: number;
    current: number;
    size: number;

    hasCount: boolean;
    hasLast: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    isFirst: boolean;
    isLast: boolean;

    toFirst(): void;
    toLast(): void;
    toNext(): void;
    toIndex(page: number): void;
    toPrevious(): void;
}

class NullPaginator implements IPaginator {
    get count() { return 0; }
    get current() { return 0; }
    get size() { return 0; }

    get hasCount() { return false; }
    get hasLast() { return false; }
    get hasNext() { return false; }
    get hasPrevious() { return false; }
    get isFirst() { return false; }
    get isLast() { return false; }

    toFirst = () => { };
    toIndex = (_: number) => { };
    toLast = () => { };
    toNext = () => { };
    toPrevious = () => { };
}

export class Paginator implements IPaginator {
    constructor(
        public readonly __current: number,
        public readonly __count: number | undefined,
        public readonly __size: number,
        protected readonly setProps: SetProps
    ) { }

    get count() { return this.__count || 0; }
    get current() { return this.__current; }
    get size() { return this.__size; }

    get hasLast() { return this.hasCount; }
    get hasNext() { return !this.hasCount || this.count > this.current; }
    get hasPrevious() { return Boolean(this.current > 0); }
    get hasCount() { return this.__count !== undefined; }
    get isFirst() { return this.current === 0; }
    get isLast() { return this.hasCount && this.current === this.count; }

    toFirst = () => this.setProps({ page_current: 0, ...clearSelection });

    toIndex = (page: number) => {
        // adjust for zero-indexing
        page--;

        if (page < 0) {
            page = 0;
        }

        if (this.hasCount && page > this.count) {
            page = this.count - 1;
        }

        this.setProps({
            page_current: page,
            ...clearSelection
        });
    }

    toLast = () => this.hasLast && this.hasCount && this.setProps({
        page_current: this.count - 1,
        ...clearSelection
    })

    toNext = () => this.hasNext && this.setProps({
        page_current: this.current + 1,
        ...clearSelection
    })

    toPrevious = () => this.hasPrevious && this.setProps({
        page_current: this.current - 1,
        ...clearSelection
    })
}

const getter = (
    page_action: TableAction,
    page_current: number,
    page_size: number,
    page_count: number | undefined,
    setProps: SetProps,
    data: Data
): IPaginator => page_action === TableAction.None ?
        new NullPaginator() :
        new Paginator(
            page_current,
            page_action === TableAction.Native ?
                Math.max(Math.ceil(data.length / page_size), 0) :
                page_count,
            page_size,
            setProps
        );

export default memoizeOneFactory(getter);