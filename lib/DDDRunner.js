'use strict'

module.exports = class DDDRunner {

    constructor() {
        console.log('DDDRunner construct');
    }

    runTask(task) {
        console.log('DDDRunner runTask');
        task.run();
    }

}
