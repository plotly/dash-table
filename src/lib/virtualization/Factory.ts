import { Dataframe, ISettings, ITarget } from './AbstractStrategy';

import FrontEndPageStrategy from './FrontEndPageStrategy';
import NoVirtualizationStrategy from './NoStrategy';
import BackEndPageStrategy from './BackEndPageStrategy';

export default class VirtualizationFactory {
    private static getAdapter(target: any): ITarget<any> {
        return {
            get dataframe(): Dataframe {
                return target.props.dataframe;
            },

            get settings(): any {
                return target.props.virtualization;
            },

            get viewportDataframe(): Dataframe {
                return target.props.virtual_dataframe;
            },

            get viewportIndices(): number[] {
                return target.props.virtual_dataframe_indices;
            },

            update(viewport: any) {
                const {
                    settings,
                    viewportDataframe,
                    viewportIndices
                } = viewport;

                setTimeout(() => {
                    if (settings) {
                        target.props.setProps({ virtualization: settings });
                    }

                    if (viewportDataframe) {
                        target.props.setProps({ virtual_dataframe: viewportDataframe });
                    }

                    if (viewportIndices) {
                        target.props.setProps({ virtual_dataframe_indices: viewportIndices });
                    }
                }, 0);
            }
        };
    }

    public static getVirtualizer(target: any, options: ISettings<any>) {
        target = VirtualizationFactory.getAdapter(target);

        switch (options.type) {
            case 'none':
                return new NoVirtualizationStrategy(target);
            case 'fe':
                switch (options.subType) {
                    case 'page':
                        return new FrontEndPageStrategy(target);
                    default:
                        throw new Error(`Unknown virtualization sub-type '${options.subType}'`);
                }
            case 'be':
                switch (options.subType) {
                    case 'page':
                        return new BackEndPageStrategy(target);
                    default:
                        throw new Error(`Unknown virtualization sub-type '${options.subType}'`);
                }
            default:
                throw new Error(`Unknown virtualization type: '${options.type}'`);
        }
    }
}