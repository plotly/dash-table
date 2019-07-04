import * as R from 'ramda';

import { memoizeOne, memoizeOneWithFlag } from 'core/memoizer';
import LocalStorage from 'core/storage/LocalStorage';

import {
    ControlledTableProps,
    SetProps
} from './props';

export default () => {
    const storage = new LocalStorage();

    const hiddenColumnsFlag = memoizeOneWithFlag(hidden_columns => hidden_columns);
    const persistHiddenColumns = memoizeOne((isFirst: boolean, setProps: SetProps, id: string, hiddenColumns?: string[]) => {
        if (hiddenColumns) {
            storage.setItem(`${id}::hidden_columns`, JSON.stringify(hiddenColumns));
        } else if (isFirst && R.isNil(hiddenColumns)) {
            const stored = storage.getItem(`${id}::hidden_columns`);
            const storedHiddenColumns = stored ?
                JSON.parse(stored) :
                [];

            setTimeout(() => setProps({ hidden_columns: storedHiddenColumns }));
        }
    });

    return (props: ControlledTableProps) => {
        const {
            hidden_columns,
            id,
            setProps
        } = props;

        const isFirst = hiddenColumnsFlag(hidden_columns).first;
        persistHiddenColumns(isFirst, setProps, id, hidden_columns);
    };
};