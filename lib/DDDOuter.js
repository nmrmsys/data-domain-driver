'use strict'

const dddInner = require('./dddInner');
const _ = require('lodash');

module.exports = class DDDOuter {

    /**
     * Construct DDD
     * @param {Object} [config] 
     * @param {String} [domain] 
     * @memberof DDDOuter
     */
    constructor(config, domain) {
        this._parseOptions(config, domain);
        console.log('DDD construct domain:' + this._domain);
        this._ = _;
        this._connections = {};
        this._dddInner = new dddInner(this);
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
     * @memberof DDDOuter
     */
    domain(domain) {
        const DDD = new DDDOuter(this._config, domain);
        DDD._connections = this._connections;
        return DDD;
    }

    _domainPath() {
        if(this._domain == 'default')
            return '../ddd/'
        else
            return '../ddd/' + this._domain + '/'
    }

    /**
     * Call Procedure
     * @param {String} name 
     * @param {Object} [params] 
     * @returns {Object}
     * @memberof DDDOuter
     */
    async callProcedure(name, params) {
        const procPath = this._domainPath() + name;
        console.log('callProcedure ' + procPath);
        const proc = new (require(procPath))(name);
        const ddd = this._dddInner;
        const returns = {};
        const defConn = this._connections['default'];
        await defConn.beginTransaction();
        await proc.call(ddd, params, returns).then(async function(ret){
            await defConn.commit();
            returns.errorCode = ret;
        }).catch(async function(error){
            await defConn.rollback();
            returns.errorCode = -1;
        });
    }

    /**
     * Destruct DDD
     * @memberof DDDOuter
     */
    async end() {
        _.each(this._connections, async function(conn) {
            // console.log(conn.URL);
            await conn.close();
        });
    }
}
