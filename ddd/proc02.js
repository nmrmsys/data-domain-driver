'use strict'
// const Procedure = require('data-domain-driver').Procedure;
const Procedure = require('../index').Procedure;

module.exports = class proc02 extends Procedure {

    async process(ddd, params, returns) {

        log('proc02 process');

        const webapi = ddd.database('webapi');

        let ret = await webapi.execute('stmt1', {FLD1:'1', FLD2:'A'});
        log('ret=' + ret);

        let rs = await webapi.query('query1', {FLD1:'1', FLD2:'A'});
        log('rs=%O', rs);
        // returns.RS = rs;
        
        return 0; // returns.returnCode
    }

}
