// var Procedure = require('data-domain-driver').Procedure;
var Procedure = require('../index').Procedure;

module.exports = class proc01 extends Procedure {

    async process(ddd, params, returns) {

        console.log('proc01 process');

        // await ddd.query('query0');
        var rs = await ddd.query('query1', {FLD1:'1', FLD2:'A'});
        // console.log(rs._rows);
        while(!rs.EOF){
            console.log(rs.FLD1, rs.FLD2, rs.FLD3);
            rs.next();
        }

        await ddd.callFunction('func01', params);

        // ddd._.each([1,2,3],function(v){console.log(v);});

        return 0; // returns.errorCode
    }

}
