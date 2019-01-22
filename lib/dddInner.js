'use strict'

module.exports = class dddInner {

    constructor(DDDOuter, database = 'default') {
        console.log('ddd construct database:' + database);
        this._DDDOuter = DDDOuter;
        this._database = database;
    }

    database(database) {
        return new dddInner(database);
    }

    query(sqlName, params) {
        console.log('ddd query sqlName:' + sqlName + ' database:' + this._database);
    }

    execute(sqlName, params) {
        console.log('ddd execute sqlName:' + sqlName + ' database:' + this._database);
    }

    callFunction(funcName, params) {
        console.log('ddd callFunction DDD:' + this._DDDOuter._domain + ' funcName:' + this.funcName);
    }

}
