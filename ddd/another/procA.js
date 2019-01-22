// var Procedure = require('data-domain-driver').Procedure;
var Procedure = require('../../index').Procedure;

module.exports = class procA extends Procedure {

    process(ddd, params, returns) {

        console.log('procA process');

        ddd.query('queryA', {FLD1:'1', FLD2:'A'});

        return 0; // returns.errorCode
    }

}
