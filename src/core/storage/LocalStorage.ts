import GenericStorage from './GenericStorage';
import { DashStorageType } from 'dash-table/dash/LocalStorage';

export default class LocalStorage extends GenericStorage {
    constructor(id: string) {
        super(localStorage, DashStorageType.Local, id);
    }
}