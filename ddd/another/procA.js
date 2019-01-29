// var Procedure = require('data-domain-driver').Procedure;
var Procedure = require('../../index').Procedure;

module.exports = class procA extends Procedure {

    async process(ddd, params, returns) {

        console.log('procA process');

        var rs = await ddd.query('queryA', {FLD1:'3', FLD2:'C'});
        while(!rs.EOF){
            console.log(rs.FLD1, rs.FLD2, rs.FLD3);
            rs.next();
        }

        return 0; // returns.errorCode
    }

}
