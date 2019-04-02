'use strict'

const Connection = require('database-js').Connection;
const _ = require('lodash');
const typeOf = require('typeof');
const chalk = require('chalk');
const sqlBehind = require('sql-behind');
const ResultSet = require('./ResultSet');
const csCRLF = '\n\r';

module.exports = class dddInner {

    /**
     * Construct ddd
     * @param {DDDOuter} DDDOuter 
     * @param {String} [database] 
     * @memberof dddInner
     */
    constructor(DDDOuter, database) {
        this._DDDOuter = DDDOuter;
        this._ = DDDOuter._;
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
        if(DDDOuter._connections[this._database]){
            this._connection = DDDOuter._connections[this._database];
        } else {
            this._connection = new Connection(this._databaseUrl);
            DDDOuter._connections[this._database] = this._connection;
        }
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
        // console.log(retSB.sqlString);
        const conn = this._connection;
        const stmt = conn.prepareStatement(retSB.sqlString);
        try {
            let rows = await stmt.query(...retSB.paramArray);
            return new ResultSet(rows);
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
        await func.call(this, params, returns).then(async function(ret){
            returns.errorCode = ret;
        }).catch(async function(error){
            console.error(chalk.red(error));
            returns.errorCode = -1;
        });
    }

    async select(tblId, selClas, wheClas, ordClas, grpClas, havClas) {
        if(typeOf(selClas) === 'string') selClas = [selClas];
        if(typeOf(selClas) === 'object') selClas = _.transform(selClas, (r,v,k) => {r.push((k + ' ' + v).trim())}, []);
        const wheKeys = _.keys(wheClas);
        const wheVals = _.values(wheClas);
        if(typeOf(ordClas) === 'string') ordClas = [ordClas];
        if(typeOf(ordClas) === 'object') ordClas = _.transform(ordClas, (r,v,k) => {r.push((k + ' ' + v).trim())}, []);
        if(typeOf(grpClas) === 'string') grpClas = [grpClas];
        if(typeOf(grpClas) === 'object') grpClas = _.transform(grpClas, (r,v,k) => {r.push((k + ' ' + v).trim())}, []);
        const havKeys = _.keys(havClas);
        const havVals = _.values(havClas);
        var sSQL = "SELECT" + csCRLF;
        _.each(selClas, (v,i) => {
            sSQL += "  ";
            if(i > 0){
                sSQL += ",";
            }
            sSQL += v + csCRLF;
        });
        sSQL += "FROM " + tblId + csCRLF;
        _.each(wheKeys, (v,i) => {
            if(i == 0){
                sSQL += "WHERE ";
            } else {
                sSQL += "  AND ";
            }
            if(wheVals[i] != null){
                sSQL += v + ' = ?' + csCRLF;
            } else {
                sSQL += v + ' IS NULL' + csCRLF;
            }
        });
        _.each(ordClas, (v,i) => {
            if(i == 0){
                sSQL += "ORDER BY ";
            } else {
                sSQL += "  ,";
            }
            sSQL += v + csCRLF;
        });
        _.each(grpClas, (v,i) => {
            if(i == 0){
                sSQL += "GROUP BY ";
            } else {
                sSQL += "  ,";
            }
            sSQL += v + csCRLF;
        });
        _.each(havKeys, (v,i) => {
            if(i == 0){
                sSQL += "HAVING ";
            } else {
                sSQL += "  AND ";
            }
            if(havVals[i] != null){
                sSQL += v + ' = ?' + csCRLF;
            } else {
                sSQL += v + ' IS NULL' + csCRLF;
            }
        });
        // console.log(sSQL);
        return this.query(sSQL, _.compact(_.concat(wheVals, havVals)));
    }
}
