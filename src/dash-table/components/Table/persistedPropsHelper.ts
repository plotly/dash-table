import * as R from 'ramda';

import { memoizeOne, memoizeOneWithFlag } from 'core/memoizer';
import Storage from 'core/storage';

import {
    ControlledTableProps,
    SetProps
} from './props';
import { LocalStorage } from 'core/storage/Storage';

export default (id: string) => {
    const storage = new Storage(id, LocalStorage);

    const hiddenColumnsFlag = memoizeOneWithFlag(hidden_columns => hidden_columns);
    const persistHiddenColumns = memoizeOne((isFirst: boolean, setProps: SetProps, hiddenColumns?: string[]) => {
        if (hiddenColumns) {
            storage.setItem('hidden_columns', hiddenColumns);
        } else if (isFirst && R.isNil(hiddenColumns)) {
            const stored = storage.getItem('hidden_columns');
            const storedHiddenColumns = stored ?
                JSON.parse(stored) :
                [];

            setTimeout(() => setProps({ hidden_columns: storedHiddenColumns }));
        }
    });

    return (props: ControlledTableProps) => {
        const {
            hidden_columns,
            setProps
        } = props;

        const isFirst = hiddenColumnsFlag(hidden_columns).first;
        persistHiddenColumns(isFirst, setProps, hidden_columns);
    };
};