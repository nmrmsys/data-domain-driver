'use strict'

const Connection = require('database-js').Connection;
const _ = require('lodash');
const sqlBehind = require('sql-behind');

module.exports = class dddInner {

    /**
     * Construct ddd
     * @param {DDDOuter} DDDOuter 
     * @param {String} [database] 
     * @memberof dddInner
     */
    constructor(DDDOuter, database) {
        this._DDDOuter = DDDOuter;
        if(DDDOuter._config.domains.default){
            this._database = DDDOuter._config.domains.default;
        } else {
            this._database = 'default';
        }
        if(_.isString(database)){
            this._database = database;
        }
        console.log('ddd construct database:' + this._database);
        this._setDatabaseUrl(this._database);
        this._connection = new Connection(this._databaseUrl);
    }

    _setDatabaseUrl(database){
        const databases = this._DDDOuter._config.databases;
        let dbObj;
        if(database == 'default'){
            if(databases['default']){
                dbObj = databases[databases['default']];
            } else {
                dbObj = databases[_.first(_.keys(databases))];
            }
        } else {
            dbObj = databases[database];
        }
        this._databaseUrl = dbObj.DriverName + '://' +
        ( dbObj.Username ? dbObj.Username : '' ) +
        ( dbObj.Password ? ':' + dbObj.Password : '' ) +
        ( dbObj.Hostname ? '@' + dbObj.Hostname : '' ) +
        ( dbObj.Port ? ':' + dbObj.Port : '' ) +
        '/' + dbObj.Database +
        ( dbObj.Parameters ? '?' + dbObj.Parameters : '' );
        // console.log('%o', this._databaseUrl);
    }

    /**
     * Set database
     * @param {String} database 
     * @returns {dddInner}
     * @memberof dddInner
     */
    database(database) {
        return new dddInner(this._DDDOuter, database);
    }

    /**
     * Query SQL
     * @param {String} sqlName 
     * @param {Object} [params] 
     * @returns {Object}
     * @memberof dddInner
     */
    async query(sqlName, params = {}) {
        console.log('ddd query sqlName:' + sqlName + ' database:' + this._database);
        const retSB = sqlBehind(sqlName, params, 2);
        const conn = this._connection;
        const stmt = conn.prepareStatement(retSB.sqlString);
        try {
            let rows = await stmt.query(...retSB.paramArray);
            return rows;
        } catch (error) {
            console.log('%o', error);
        }
    }

    /**
     * Execute SQL
     * @param {String} sqlName 
     * @param {Object} [params] 
     * @memberof dddInner
     */
    async execute(sqlName, params) {
        console.log('ddd execute sqlName:' + sqlName + ' database:' + this._database);
        const retSB = sqlBehind(sqlName, params, 2);
        const conn = this._connection;
        const stmt = conn.prepareStatement(retSB.sqlString);
        try {
            await stmt.execute(...retSB.paramArray);
        } catch (error) {
            console.log('%o', error);
        }
    }

    /**
     * Call Function
     * @param {String} funcName 
     * @param {Object} [params] 
     * @returns {Object}
     * @memberof dddInner
     */
    async callFunction(funcName, params) {
        const DDD = this._DDDOuter;
        console.log('ddd callFunction DDD:' + DDD._domain + ' funcName:' + funcName);
        const funcPath = DDD._domainPath() + 'func/' + funcName;
        const func = new (require(funcPath))(funcName);
        const returns = {};
        await func.call(this, params, returns);
    }

}
