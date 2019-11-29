// const Procedure = require('data-domain-driver').Procedure;
const Procedure = require('../index').Procedure;

module.exports = class proc01 extends Procedure {

    async process(ddd, params, returns) {

        log('proc01 process');

        // await ddd.query('query0');
        var rs = await ddd.query('query1', {FLD1:'1', FLD2:'A'});
        // log(rs._rows);
        while(!rs.EOF){
            log(rs.FLD1, rs.FLD2, rs.FLD3);
            rs.next();
        }

        await ddd.callFunction('func01', params);
        // await ddd.callFunction('sub/func01', params);

        _.each([1,2,3],function(v){log(v)});
        alasql('CREATE TABLE ala_tbl (fld1 INT, fld2 INT, fld3 INT)');
        alasql('INSERT INTO ala_tbl VALUES(1,2,3)');
        alasql('INSERT INTO ala_tbl VALUES(4,5,6)');
        alasql('INSERT INTO ala_tbl VALUES(7,8,9)');
        var rows = alasql('SELECT * FROM ala_tbl');
        log(rows);

        return 0; // returns.returnCode
    }

}
