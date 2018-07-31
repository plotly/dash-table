import { IVirtualizationOptions } from './AbstractStrategy';

import NoVirtualizationStrategy from '../virtualization/NoStrategy';
import FrontEndPageStrategy from '../virtualization/FrontEndPageStrategy';

export default class VirtualizationFactory {
    public static getVirtualizer(target: any, options: IVirtualizationOptions) {
        switch (options.type) {
            case 'none':
                return new NoVirtualizationStrategy(target);
            case 'legacy':
                return null;
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