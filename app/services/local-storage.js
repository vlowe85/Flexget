require( "nativescript-localstorage" );

export default class LocalStorage {

    constructor() {
        console.log("Keys stored", localStorage.length);
    }

    save(key, value) {
        localStorage.setItem(key, value);
        return value;
    }

    saveObject(key, value) {
        localStorage.setItemObject(key, value);
        return value;
    }

    load(key) {
        return localStorage.getItem(key);
    }

    delete(key) {
        localStorage.removeItem(key);
    }

    clear() {
        localStorage.clear();
    }
}
