'use strict'

module.exports = class DDDRunner {

    constructor(config) {
        console.log('DDDRunner construct');
        if (typeof config == 'undefined'){
            const nc = require('config');
            config = nc.util.toObject(nc.get('ddd'));
        }
        this._DDD = new (require('../index').DDD)(config);
    }

    async runTask(task) {
        console.log('DDDRunner runTask');
        const config = this._DDD._config;
        if(config.domains.default){
            for (let domain of _.keys(config.domains)) {
                await this.taskRun(task, domain);
            }
        } else {
            await this.taskRun(task, 'default');
            for (let domain of _.keys(config.domains)) {
                await this.taskRun(task, domain);
            }
        }
    }

    async taskRun(task, domain){
        const args = task._args;
        const DDD = this._DDD.domain(domain);
        const ddd = DDD._dddInner;
        await task.run(args, domain, DDD, ddd);
    }

}
