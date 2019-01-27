// var Procedure = require('data-domain-driver').Procedure;
var Procedure = require('../../index').Procedure;

module.exports = class procA extends Procedure {

    async process(ddd, params, returns) {

        console.log('procA process');

        var rows = await ddd.query('queryA', {FLD1:'3', FLD2:'C'});
        console.log('%o', rows);

        return 0; // returns.errorCode
    }

}
