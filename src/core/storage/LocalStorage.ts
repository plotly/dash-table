import GenericStorage from './GenericStorage';

export default class LocalStorage extends GenericStorage {
    constructor() {
        super(localStorage);
    }
}