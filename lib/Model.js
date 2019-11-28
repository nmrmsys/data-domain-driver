'use strict'

const _ = require('lodash');
const Utils = require('./Utils');

module.exports = class Model {

    constructor(data) {
        console.log(this.constructor.name + ' construct');
        this.data = data;
    }

    get data() {
        console.log(this.constructor.name + ' get data');
        // return this._data;
    }

    set data(data) {
        console.log(this.constructor.name + ' set data');
        // this._data = data;
        _.assign(this, Utils.data2prop(data));
    }

}
