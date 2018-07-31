import { IVirtualizationOptions } from './AbstractStrategy';

import FrontEndPageStrategy from './FrontEndPageStrategy';
import NoVirtualizationStrategy from './NoStrategy';
import BackEndPageStrategy from './BackEndPageStrategy';

export default class VirtualizationFactory {
    public static getVirtualizer(target: any, options: IVirtualizationOptions) {
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