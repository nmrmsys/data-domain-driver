'use strict'

var dddInner = require('./dddInner');

module.exports = class DDDOuter {

    constructor(domain = 'default') {
        console.log('DDD construct domain:' + domain);
        this._domain = domain;
        this._dddInner = new dddInner(this);
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
