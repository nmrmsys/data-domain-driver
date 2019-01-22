'use strict'

module.exports = class Procedure {

    constructor(name) {
        // console.log('Procedure construct name:' + name);
        this._name = name;
    }

    call(ddd, params, returns) {
        // console.log('Procedure call');
        this.process(ddd, params, returns);
    }

}
