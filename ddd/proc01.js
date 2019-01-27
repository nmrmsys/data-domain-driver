// var Procedure = require('data-domain-driver').Procedure;
var Procedure = require('../index').Procedure;

module.exports = class proc01 extends Procedure {

    async process(ddd, params, returns) {

        console.log('proc01 process');

        // await ddd.query('query0');
        var rows = await ddd.query('query1', {FLD1:'1', FLD2:'A'});
        console.log('%o', rows);

        await ddd.callFunction('func01', params);

        return 0; // returns.errorCode
    }

}
