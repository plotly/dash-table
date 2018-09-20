import * as R from 'ramda';

import { memoizeOneWithFlag } from 'core/memoizer';
import sort, { defaultIsNully, SortSettings } from 'core/sorting';
import SyntaxTree from 'core/syntax-tree';
import {
    Dataframe,
    Datum,
    Indices,
    PropsWithDefaults,
    Filtering,
    Sorting
} from 'dash-table/components/Table/props';

interface IResult {
    virtual_dataframe: Dataframe;
    virtual_indices: Indices;
}

export default class VirtualDataframeAdapter {
    constructor(private readonly propsFn: () => PropsWithDefaults) {

    }

    get() {
        const {
            dataframe,
            filtering,
            filtering_settings,
            sorting,
            sorting_settings,
            sorting_treat_empty_string_as_none
        } = this.props;

        return this.getDataframe(
            dataframe,
            filtering,
            filtering_settings,
            sorting,
            sorting_settings,
            sorting_treat_empty_string_as_none
        );
    }

    private get props() {
        return this.propsFn();
    }

    private getDataframe = memoizeOneWithFlag((
        dataframe: Dataframe,
        filtering: Filtering,
        filtering_settings: string,
        sorting: Sorting,
        sorting_settings: SortSettings = [],
        sorting_treat_empty_string_as_none: boolean
    ): IResult => {
        const map = new Map<Datum, number>();
        R.addIndex(R.forEach)((datum, index) => {
            map.set(datum, index);
        }, dataframe);

        if (filtering === 'fe' || filtering === true) {
            const tree = new SyntaxTree(filtering_settings);

            dataframe = tree.isValid ?
                tree.filter(dataframe) :
                dataframe;
        }

        const isNully = sorting_treat_empty_string_as_none ?
            (value: any) => value === '' || defaultIsNully(value) :
            undefined;

        if (sorting === 'fe' || sorting === true) {
            dataframe = sort(dataframe, sorting_settings, isNully);
        }

        // virtual_indices
        const indices = R.map(datum => map.get(datum) as number, dataframe);

        return {
            virtual_dataframe: dataframe,
            virtual_indices: indices
        };
    });
}