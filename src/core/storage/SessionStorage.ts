import GenericStorage from './GenericStorage';

export default class SessionStorage extends GenericStorage {
    constructor() {
        super(sessionStorage);
    }
}