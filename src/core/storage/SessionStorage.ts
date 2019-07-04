import GenericStorage from './GenericStorage';
import { DashStorageType } from 'dash-table/dash/LocalStorage';

export default class SessionStorage extends GenericStorage {
    constructor(id: string) {
        super(sessionStorage, DashStorageType.Session, id);
    }
}