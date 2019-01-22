// var Procedure = require('data-domain-driver').Procedure;
var Procedure = require('../index').Procedure;

module.exports = class proc01 extends Procedure {

    process(ddd, params, returns) {

        console.log('proc01 process');

        ddd.query('query1', params);

        ddd.callFunction('func01', params);

        return 0; // returns.errorCode
    }

}
