import * as R from 'ramda';

import { memoizeOne, memoizeOneWithFlag } from 'core/memoizer';
import Storage from 'core/storage';

import {
    ControlledTableProps,
    Persisted,
    SetProps
} from './props';
import { LocalStorage } from 'core/storage/Storage';

// interface IColumnNames {
//     [key: string]: string | string[];
// }

export default (id: string) => {
    const storage = new Storage(id, LocalStorage);

    const hiddenColumnsFlag = memoizeOneWithFlag(hidden_columns => hidden_columns);
    const persistHiddenColumns = memoizeOne((isFirst: boolean, setProps: SetProps, hiddenColumns?: string[]) => {
        if (isFirst && R.isNil(hiddenColumns)) {
            const stored = storage.getItem('hidden_columns', []);

            setTimeout(() => setProps({ hidden_columns: stored }));
        } else if (!isFirst) {
            storage.setItem('hidden_columns', hiddenColumns);
        }
    });

    // const columnNamesFlag = memoizeOneWithFlag(columns => columns);
    // const persistColumnNames = memoizeOne((isFirst: boolean, setProps: SetProps, columns: Columns) => {
    //     if (isFirst) {
    //         let callSetProps = false;
    //         const stored: IColumnNames = storage.getItem('column_names', {});
    //         console.log('[persist, retrieve] column_names', stored);

    //         columns = R.clone(columns);
    //         columns.forEach(c => {
    //             callSetProps = callSetProps || !R.isNil(stored[c.id]);
    //             c.name = stored[c.id] || c.name;
    //         });

    //         if (callSetProps) {
    //             setTimeout(() => setProps({ columns }));
    //         }
    //     } else {
    //         const columnNames = columns.reduce((res: IColumnNames, c) => {
    //             res[c.id] = c.name;
    //             return res;
    //         }, {});

    //         console.log('[persist, store] column_names', columnNames);
    //         storage.setItem('column_names', columnNames);
    //     }
    // });

    return (props: ControlledTableProps) => {
        const {
            hidden_columns,
            persisted,
            setProps
        } = props;

        if (R.contains(Persisted.HiddenColumn, persisted)) {
            persistHiddenColumns(
                hiddenColumnsFlag(hidden_columns).first,
                setProps,
                hidden_columns
            );
        }
    };
};