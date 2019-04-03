'use strict'

module.exports = class Procedure {

    /**
     * Construct Procedure
     * @constructor 
     * @param {String} name 
     */
    constructor(name) {
        // console.log('Procedure construct name:' + name);
        this._name = name;
    }

    /**
     * Call process
     * @param {dddInner} ddd 
     * @param {Object} params 
     * @param {Object} returns 
     * @returns {Number}
     */
    async call(ddd, params, returns) {
        // console.log('Procedure call');
        return await this.process(ddd, params, returns);
    }

}
