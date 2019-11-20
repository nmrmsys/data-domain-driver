'use strict'

const Connection = require('database-js').Connection;
const _ = require('lodash');
const typeOf = require('typeof');
const chalk = require('chalk');
const sqlBehind = require('sql-behind');
const ResultSet = require('./ResultSet');
const DataSet = require('./DataSet');
const Utils = require('./Utils');
const csCRLF = '\r\n';

module.exports = class dddInner {

    /**
     * Construct ddd
     * @constructor 
     * @param {DDDOuter} DDDOuter 
     * @param {String} [database] 
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
        log.info('ddd construct database:' + this._database);
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
        // log('%o', this._databaseUrl);
    }

    /**
     * Set database
     * @param {String} database 
     * @returns {dddInner}
     */
    database(database) {
        return new dddInner(this._DDDOuter, database);
    }

    /**
     * Query SQL
     * @param {String} sqlName 
     * @param {String[]|Object} [params] 
     * @returns {ResultSet}
     */
    async query(sqlName, params = {}) {
        sqlName = this._sqlInfoLog('query', sqlName, params);
        const retSB = sqlBehind(sqlName, params, 2);
        log(retSB.sqlString);
        const conn = this._connection;
        const stmt = conn.prepareStatement(retSB.sqlString);
        try {
            let rows = await stmt.query(...retSB.paramArray);
            return new ResultSet(rows);
        } catch (error) {
            log.error('%o', error);
        }
    }

    /**
     * Execute SQL
     * @param {String} sqlName 
     * @param {String[]|Object} [params] 
     */
    async execute(sqlName, params) {
        sqlName = this._sqlInfoLog('execute', sqlName, params);
        const retSB = sqlBehind(sqlName, params, 2);
        log(retSB.sqlString);
        const conn = this._connection;
        const stmt = conn.prepareStatement(retSB.sqlString);
        try {
            await stmt.execute(...retSB.paramArray);
        } catch (error) {
            log.error('%o', error);
        }
    }

    _sqlInfoLog(method, sqlName, params) {
        let match = sqlName.match(/^OTQB: (.*),(.*)\r\n/);
        if(match){
            log.info('ddd ' + match[1] + ' tableName:' + match[2] + ' database:' + this._database);
            sqlName = sqlName.replace(/^OTQB: .*\r\n/,'');
        } else {
            match = sqlName.match(/^(SELECT|INSERT|UPDATE|DELETE)\s/i);
            if(match){
                log.info('ddd ' + method + ' ' + match[1] + ' database:' + this._database);
            } else {
                log.info('ddd ' + method + ' sqlName:' + sqlName + ' database:' + this._database);
            }
        }
        return sqlName;
    }

    /**
     * Call Function
     * @param {String} funcName 
     * @param {String[]|Object} [params] 
     * @returns {Object}
     */
    async callFunction(funcName, params) {
        const DDD = this._DDDOuter;
        log.info('ddd callFunction domain:' + DDD._domain + ' funcName:' + funcName);
        if(log.level == 'debug'){
            log.debug('params: ' + Utils.dump(params));
        } else {
            log.info('params: ' + Utils.dump(_.keys(params)));
        }
        const funcPath = DDD._domainPath() + 'func/' + funcName;
        const func = new (require(funcPath))(funcName);
        const returns = new DataSet();
        await func.call(this, params, returns).then(async function(ret){
            returns.returnCode = ret;
        }).catch(async function(error){
            log.error(chalk.red(error)); // TODO FIX
            returns.returnCode = -1;
        });
        if(log.level == 'debug'){
            log.debug('returns: ' + Utils.dump(returns));
        } else {
            log.info('returns: ' + Utils.dump(_.keys(returns)));
        }
    }

    /**
     * Select SQL
     * @param {String} tblId
     * @param {String|String[]|Object} [selClas] 
     * @param {Object} [wheClas] 
     * @param {String|String[]|Object} [ordClas] 
     * @param {String|String[]|Object} [grpClas] 
     * @param {Object} [havClas] 
     * @returns {ResultSet}
     */
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
        let sSQL = "OTQB: select," + tblId + csCRLF;
        sSQL += "SELECT" + csCRLF;
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
                _.pullAt(wheVals, i);
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
                _.pullAt(havVals, i);
            }
        });
        // log(sSQL);
        return this.query(sSQL, _.concat(wheVals, havVals));
    }

    /**
     * Insert SQL
     * @param {String} tblId
     * @param {Object} [insClas] 
     */
    async insert(tblId, insClas) {
        const insKeys = _.keys(insClas);
        const insVals = _.values(insClas);
        let sSQL = "OTQB: insert," + tblId + csCRLF;
        sSQL += "INSERT INTO " + tblId + '(' + csCRLF;
        _.each(insKeys, (v,i) => {
            sSQL += "  ";
            if(i > 0){
                sSQL += ",";
            }
            sSQL += v + csCRLF;
        });
        sSQL += ") VALUES(" + csCRLF;
        _.each(insVals, (v,i) => {
            sSQL += "  ";
            if(i > 0){
                sSQL += ",";
            }
            if(insVals[i] != null){
                sSQL += '?' + csCRLF;
            } else {
                sSQL += 'NULL' + csCRLF;
                _.pullAt(insVals, i);
            }
        });
        sSQL += ")" + csCRLF;
        // log(sSQL);
        return this.execute(sSQL, insVals);
    }

    /**
     * Update SQL
     * @param {String} tblId
     * @param {Object} [updClas] 
     * @param {Object} [wheClas] 
     */
    async update(tblId, updClas, wheClas) {
        const updKeys = _.keys(updClas);
        const updVals = _.values(updClas);
        const wheKeys = _.keys(wheClas);
        const wheVals = _.values(wheClas);
        let sSQL = "OTQB: update," + tblId + csCRLF;
        sSQL += "UPDATE " + tblId + csCRLF;
        _.each(updKeys, (v,i) => {
            if(i == 0){
                sSQL += "SET ";
            } else {
                sSQL += "  ,";
            }
            if(updVals[i] != null){
                sSQL += v + ' = ?' + csCRLF;
            } else {
                sSQL += v + ' = NULL' + csCRLF;
                _.pullAt(updVals, i);
            }
        });
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
                _.pullAt(wheVals, i);
            }
        });
        // log(sSQL);
        return this.execute(sSQL, _.concat(updVals, wheVals));
    }

    /**
     * Delete SQL
     * @param {String} tblId
     * @param {Object} [wheClas] 
     */
    async delete(tblId, wheClas) {
        const wheKeys = _.keys(wheClas);
        const wheVals = _.values(wheClas);
        let sSQL = "OTQB: delete," + tblId + csCRLF;
        sSQL += "DELETE FROM " + tblId + csCRLF;
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
                _.pullAt(wheVals, i);
            }
        });
        // log(sSQL);
        return this.execute(sSQL, wheVals);
    }

    /**
     * Get SQL
     * @param {String} tblId
     * @param {String|String[]|Object} [selClas] 
     * @param {Object} [wheClas] 
     * @param {String|String[]|Object} [ordClas] 
     * @param {String|String[]|Object} [grpClas] 
     * @param {Object} [havClas] 
     * @returns {ResultSet}
     */
    async get(tblId, selClas, wheClas, ordClas, grpClas, havClas) {
        const rs = await this.select(tblId, selClas, wheClas, ordClas, grpClas, havClas);
        switch (rs.count) {
            case 0:
                return '';
            case 1:
                if(rs.columnNames.length == 1)
                    return rs.getValue(1,1);
                else
                    return rs.rows;
            default:
                return rs.rows;
        }
    }

    /**
     * Set SQL
     * @param {String} tblId
     * @param {Object} [setClas] 
     * @param {Object} [wheClas] 
     */
    async set(tblId, setClas, wheClas) {
        const setKeys = _.keys(setClas);
        const setVals = _.values(setClas);
        const rs = await this.select(tblId, setKeys, wheClas);
        if(rs.count == 0){
            return this.insert(tblId, _.merge(setClas, wheClas));
        } else {
            return this.update(tblId, setClas, wheClas);
        }
    }
}
