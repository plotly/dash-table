import { Dataframe, ISettings, ITarget } from 'dash-table/virtualization/AbstractStrategy';

export default class VirtualizationAdapter implements ITarget {
    constructor(private readonly target: any) {

    }

    get dataframe(): Dataframe {
        return this.target.props.dataframe;
    }

    get settings(): ISettings {
        return this.target.props.virtualization_settings;
    }

    get virtualization(): string {
        return this.target.props.virtualization;
    }

    get viewportDataframe(): Dataframe {
        return this.target.props.virtual_dataframe;
    }

    get viewportIndices(): number[] {
        return this.target.props.virtual_dataframe_indices;
    }

    update(viewport: any) {
        const setProps = this.target.setProps;

        const {
            settings,
            viewportDataframe,
            viewportIndices
        } = viewport;

        let props = Object.assign(
            {},
            settings ? { virtualization_settings: settings } : {},
            viewportDataframe ? { virtual_dataframe: viewportDataframe } : {},
            viewportIndices ? { virtual_dataframe_indices: viewportIndices } : {}
        );

        setTimeout(() => { setProps(props); }, 0);
    }
}