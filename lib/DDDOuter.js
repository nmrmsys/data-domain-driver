'use strict'

var dddInner = require('./dddInner');
var _ = require('lodash');

module.exports = class DDDOuter {

    constructor(config) {
        this._parseOptions(config);
        console.log('DDD construct domain:' + this._domain);
        this._dddInner = new dddInner(this);
    }

    _parseOptions(config) {
        this._domain = 'default';
        if(_.isString(config)){
            this._domain = config;
        }
        if(_.isObject(config)){
            this._config = config;
            if(config.domains.default){
                this._domain = config.domains.default;
            }
        }
    }

    domain(domain) {
        return new DDDOuter(domain);
    }

    _domainPath() {
        if(this._domain == 'default')
            return '../ddd/'
        else
            return '../ddd/' + this._domain + '/'
    }

    callProcedure(name, params) {
        let procPath = this._domainPath() + name;
        console.log('callProcedure ' + procPath);
        var proc = new (require(procPath))(name);
        let returns = {};
        proc.call(this._dddInner, params, returns);
    }

}
