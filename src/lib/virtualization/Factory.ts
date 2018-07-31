import { IVirtualizationOptions } from './AbstractStrategy';

import FrontEndPageStrategy from './FrontEndPageStrategy';
import LegacyStrategy from './LegacyStrategy';
import NoVirtualizationStrategy from './NoStrategy';

export default class VirtualizationFactory {
    public static getVirtualizer(target: any, options: IVirtualizationOptions) {
        switch (options.type) {
            case 'none':
                return new NoVirtualizationStrategy(target);
            case 'legacy':
                return new LegacyStrategy(target);
            case 'fe':
                switch (options.subType) {
                    case 'page':
                        return new FrontEndPageStrategy(target);
                    default:
                        throw new Error(`Unknown virtualization sub-type '${options.subType}'`);
                }
            case 'be':
                throw new Error(`The 'be' virtualization type is not implemented`);
            default:
                throw new Error(`Unknown virtualization type: '${options.type}'`);
        }
    }
}