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
        const defPaths = {ddd:'ddd', func:'func', model:'model'};
        if(config.paths){
            _.defaults(config.paths, defPaths);
        } else {
            config.paths = defPaths;
        }
        this._paths = config.paths;
        // console.log('_paths: %O',this._paths);
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

    _dddPath() {
        return this._appRootPath + '/' + this._paths.ddd + '/'
    }

    /**
     * Call Procedure
     * @param {String} procName 
     * @param {Object} [params] 
     * @returns {Object}
     */
    async callProcedure(procName, params) {
        if(this._domain == 'default')
            this._procName = procName;
        else
            this._procName = this._domain + '/' + procName;
        this._funcName = '';
        log.info('DDD callProcedure ' + this._procName);
        const procPath = this._dddPath() + this._procName;
        const procClsName = this._procName.replace(/.*\//,'');
        if(log.level == 'debug'){
            log.debug('params: ' + Utils.dump(params));
        } else {
            log.info('params: ' + Utils.dump(_.keys(params)));
        }
        const proc = new (require(procPath))(procClsName);
        const ddd = this._dddInner;
        const returns = new DataSet();
        returns._DDD = this;
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
        return returns;
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
