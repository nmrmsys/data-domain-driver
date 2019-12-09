'use strict'

module.exports = class Task {

    constructor(args) {
        console.log(this.constructor.name + ' Task construct');
        this._args = args;
    }

    async run(args, domain, DDD, ddd) {
        console.log(this.constructor.name + ' Task run domain:' + domain);
    }

}
