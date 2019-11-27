'use strict'

const chalk = require('chalk');
const appRootPath = require('app-root-path');

const dddInner = require('./dddInner');
const LoggerWrapper = require('./LoggerWrapper');
const DataSet = require('./DataSet');
const Utils = require('./Utils');

global._ = require('lodash');
global.alasql = require('alasql');

module.exports = class DDDOuter {

    /**
     * Construct DDD
     * @param {Object} [config] 
     * @param {String} [domain] 
     */
    constructor(config, domain) {
        this._parseOptions(config, domain);
        global.log = LoggerWrapper(this._config.log);
        log.info('DDD construct domain:' + this._domain);
        this._ = _;
        this._connections = {};
        this._dddInner = new dddInner(this);
        this._appRootPath = appRootPath;
    }

    _parseOptions(config, domain) {
        if(_.isObject(config)){
            this._config = config;
            if(config.domains.default){
                this._domain = config.domains.default;
            } else {
                this._domain = 'default';
            }
        } else {
            this._config = {};
        }
        if(_.isString(domain)){
            this._domain = domain;
        }
    }

    /**
     * Set domain
     * @param {String} domain 
     * @returns {DDDOuter}
     */
    domain(domain) {
        const DDD = new DDDOuter(this._config, domain);
        DDD._connections = this._connections;
        return DDD;
    }

    _domainPath() {
        if(this._domain == 'default')
            return this._appRootPath + '/ddd/'
        else
            return this._appRootPath + '/ddd/' + this._domain + '/'
    }

    /**
     * Call Procedure
     * @param {String} name 
     * @param {Object} [params] 
     * @returns {Object}
     */
    async callProcedure(name, params) {
        if(this._domain == 'default')
            this._procName = name;
        else
            this._procName = this._domain + '/' + name;
        log.info('DDD callProcedure ' + this._procName);
        const procPath = this._domainPath() + name;
        if(log.level == 'debug'){
            log.debug('params: ' + Utils.dump(params));
        } else {
            log.info('params: ' + Utils.dump(_.keys(params)));
        }
        const proc = new (require(procPath))(name);
        const ddd = this._dddInner;
        const returns = new DataSet();
        const defConn = this._connections['default'];
        await defConn.beginTransaction();
        await proc.call(ddd, params, returns).then(async function(ret){
            await defConn.commit();
            returns.returnCode = ret;
        }).catch(async function(error){
            log.error(chalk.red(error)); // TODO FIX
            await defConn.rollback();
            returns.returnCode = -1;
        });
        if(log.level == 'debug'){
            log.debug('returns: ' + Utils.dump(returns));
        } else {
            log.info('returns: ' + Utils.dump(_.keys(returns)));
        }
        this._procName = '';
    }

    /**
     * Destruct DDD
     */
    async end() {
        _.each(this._connections, async function(conn) {
            // log(conn.URL);
            await conn.close();
        });
    }
}
