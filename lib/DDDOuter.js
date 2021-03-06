'use strict'

const chalk = require('chalk');
const appRootPath = require('app-root-path');
const typeOf = require('typeof');
const Validator = require('validatorjs');

const dddInner = require('./dddInner');
const LoggerWrapper = require('./LoggerWrapper');

// global.Procedure = require('./Procedure');
// global.Function = require('./Function');
const Procedure = require('./Procedure');
const Function = require('./Function');
global.DataSet = require('./DataSet');
global.ResultSet = require('./ResultSet');
global.Model = require('./Model');
global.Utils = require('./Utils');

global._ = require('lodash');
global.alasql = require('alasql');

module.exports = class DDDOuter {

    /**
     * Construct DDD
     * @param {Object} [config] 
     * @param {String} [domain] 
     */
    constructor(config, domain) {
        if (typeof config == 'undefined'){
            const nc = require('config');
            config = nc.util.toObject(nc.get('ddd'));
        }
        this._parseOptions(config, domain);
        global.log = LoggerWrapper(this._config.log);
        log.info('DDD construct domain:' + this._domain);
        // this._ = _;
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
        const defPaths = {ddd:'ddd', func:'func', model:'model', ddl:'ddl', def:'def'};
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

    _domainPath() {
        const domainPath = _.get(this._config.domains, this._domain + '.path', this._domain);
        if(this._domain == 'default')
            return '';
        else
            return domainPath + '/';
    }

    _getPath(type) {
        return this._dddPath() + this._domainPath() + this._paths[type] + '/';
    }

    /**
     * Call Procedure
     * @param {String} procName 
     * @param {Object} [params] 
     * @returns {Object}
     */
    async callProcedure(procName, params={}) {
        this._procName = this._domainPath() + procName;
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
        let rules = {};
        if(proc.params)
            rules = proc.params();
        const validation = new Validator(params, rules);
        returns.errors = validation.errors;
        if(validation.passes()) {
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
        } else {
            returns.returnCode = -2;
        }
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
            if(typeOf(conn) === 'connection')
                await conn.close();
        });
    }
}
