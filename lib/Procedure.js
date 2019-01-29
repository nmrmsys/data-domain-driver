'use strict'

module.exports = class Procedure {

    constructor(name) {
        // console.log('Procedure construct name:' + name);
        this._name = name;
    }

    async call(ddd, params, returns) {
        // console.log('Procedure call');
        return await this.process(ddd, params, returns);
    }

}
