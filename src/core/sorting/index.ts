import * as R from 'ramda';
import Logger from 'core/Logger';

export interface ISortSetting {
    columnId: string | number;
    direction: SortDirection;
}

export enum SortDirection {
    Ascending = 'asc',
    Descending = 'desc'
}

export type SortSettings = ISortSetting[];

export function updateSettings(
    settings: SortSettings,
    columnId: string | number
): SortSettings {
    Logger.trace('updateSettings', settings, columnId);

    settings = R.clone(settings);

    const setting = R.find(s => s.columnId === columnId, settings);

    if (setting && setting.direction === SortDirection.Descending) {
        setting.direction = SortDirection.Ascending;
    } else if (setting && setting.direction === SortDirection.Ascending) {
        settings = R.filter(R.complement(R.propEq('columnId', columnId)), settings);
    } else {
        settings.push({
            columnId,
            direction: SortDirection.Descending
        });
    }

    return settings;
}

export default (dataframe: any[], settings: SortSettings): any[] => {
    if (!settings.length) {
        return dataframe;
    }

    return R.sortWith(
        R.map(setting => {
            return setting.direction === SortDirection.Descending ?
                R.comparator((d1: any, d2: any) => {
                    const id = setting.columnId;

                    const prop1 = d1[id];
                    const prop2 = d2[id];

                    if (prop1 === undefined || prop1 === null) {
                        return false;
                    } else if (prop2 === undefined || prop2 === null) {
                        return true;
                    }

                    return prop1 > prop2;
                }) :
                R.comparator((d1: any, d2: any) => {
                    const id = setting.columnId;

                    const prop1 = d1[id];
                    const prop2 = d2[id];

                    if (prop1 === undefined || prop1 === null) {
                        return false;
                    } else if (prop2 === undefined || prop2 === null) {
                        return true;
                    }

                    return prop1 < prop2;
                });
        }, settings),
        dataframe
    );
};