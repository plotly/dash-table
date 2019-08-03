import * as R from 'ramda';

import Storage from 'core/storage';

import {
    ControlledTableProps,
    Persisted
} from './props';
import { LocalStorage } from 'core/storage/Storage';

export default (id: string) => {
    const storage = new Storage(id, LocalStorage);

    let column_names_initialized = false;
    let hidden_columns_initialized = false;
    return {
        check: (props: ControlledTableProps) => {
            const {
                columns,
                hidden_columns,
                persisted,
                setProps
            } = props;

            if (R.contains(Persisted.HiddenColumn, persisted)) {
                const hash = hidden_columns || [];
                const previousHash = storage.getItem('hidden_columns--hash');

                const isEqual = JSON.stringify(hash) === JSON.stringify(previousHash);

                if (!hidden_columns_initialized) {
                    hidden_columns_initialized = true;
                    if (isEqual) {
                        const stored = storage.getItem('hidden_columns', []);

                        setTimeout(() => setProps({ hidden_columns: stored }));
                    } else {
                        storage.setItem('hidden_columns--hash', hash);
                        storage.setItem('hidden_columns', []);
                    }
                } else {
                    storage.setItem('hidden_columns', hash);
                }
            }

            if (R.contains(Persisted.ColumnNames, persisted)) {
                const hash = columns.reduce((res: any, c) => {
                    res[c.id] = c.name;
                    return res;
                }, {});
                const previousHash = storage.getItem('column_names--hash');

                const isEqual = JSON.stringify(hash) === JSON.stringify(previousHash);

                if (!column_names_initialized) {
                    column_names_initialized = true;
                    if (isEqual) {
                        const stored = storage.getItem('column_names', {});

                        const newColumns = R.clone(columns);
                        newColumns.forEach(c => {
                            c.name = stored[c.id];
                        });

                        setTimeout(() => setProps({ columns: newColumns }));
                    } else {
                        storage.setItem('column_names--hash', hash);
                        storage.setItem('column_names', {});
                    }
                } else {
                    storage.setItem('column_names', hash);
                }
            }
        },
        update: (props: ControlledTableProps, newProps: Partial<ControlledTableProps>) => {
            const {
                persisted
            } = props;

            if (R.contains(Persisted.HiddenColumn, persisted)) {
                const hidden_columns = newProps.hidden_columns;
                if (hidden_columns) {
                    storage.setItem('hidden_columns', hidden_columns);
                }
            }

            if (R.contains(Persisted.ColumnNames, persisted)) {
                const columns = newProps.columns;
                if (columns) {
                    storage.setItem('column_names', columns.reduce((res: any, c) => {
                        res[c.id] = c.name;
                        return res;
                    }, {}));
                }
            }
        }
    };
};