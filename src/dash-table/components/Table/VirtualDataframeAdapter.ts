import * as R from 'ramda';

import { ITarget, IViewport } from 'dash-table/pagination/AbstractStrategy';
import { memoizeOne } from 'core/memoizer';
import sort, { defaultIsNully, SortSettings } from 'core/sorting';
import SyntaxTree from 'core/syntax-tree';
import Table from 'dash-table/components/Table';
import { Dataframe, IPaginationSettings, PaginationMode, Datum, Indices } from 'dash-table/components/Table/props';

export default class VirtualDataframeAdapter implements ITarget {
    constructor(private readonly target: Table) {

    }

    private getDataframe = memoizeOne((
        dataframe: Dataframe,
        filtering: string | boolean,
        filtering_settings: string,
        sorting: string | boolean,
        sorting_settings: SortSettings = [],
        sorting_treat_empty_string_as_none: boolean
    ): { dataframe: Dataframe, indices: Indices } => {
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

        return { dataframe, indices };
    });

    private get dataframeAndIndices() {
        const {
            dataframe,
            filtering,
            filtering_settings,
            sorting,
            sorting_settings,
            sorting_treat_empty_string_as_none
        } = this.target.props;

        return this.getDataframe(
            dataframe,
            filtering,
            filtering_settings,
            sorting,
            sorting_settings,
            sorting_treat_empty_string_as_none
        );
    }

    get dataframe(): Dataframe {
        return this.dataframeAndIndices.dataframe;
    }

    get indices(): Indices {
        return this.dataframeAndIndices.indices;
    }

    get settings(): IPaginationSettings {
        return this.target.props.pagination_settings;
    }

    get pageMode(): PaginationMode {
        return this.target.props.pagination_mode;
    }

    get viewportDataframe(): Dataframe {
        return this.target.props.derived_viewport_dataframe;
    }

    get viewportIndices(): number[] {
        return this.target.props.derived_viewport_indices;
    }

    update(viewport: Partial<IViewport>) {
        const setProps = this.target.setProps;

        const {
            settings,
            viewportDataframe,
            viewportIndices
        } = viewport;

        const {
            dataframe,
            indices
        } = this;

        let props = R.mergeAll([
            settings ? { pagination_settings: settings } : {},
            dataframe ? { derived_virtual_dataframe: dataframe } : {},
            indices ? { derived_virtual_indices: indices } : {},
            viewportDataframe ? { derived_viewport_dataframe: viewportDataframe } : {},
            viewportIndices ? { derived_viewport_indices: viewportIndices } : {}
        ]);

        setTimeout(() => { setProps(props); }, 0);
    }
}