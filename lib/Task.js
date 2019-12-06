'use strict'

module.exports = class Task {

    constructor() {
        console.log(this.constructor.name + ' Task construct');
    }

    run(args) {
        console.log(this.constructor.name + ' Task run');
    }

}
