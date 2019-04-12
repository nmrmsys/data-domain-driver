// var Procedure = require('data-domain-driver').Procedure;
var Procedure = require('../../index').Procedure;

module.exports = class procA extends Procedure {

    async process(ddd, params, returns) {

        log('procA process');

        var rs = await ddd.query('queryA', {FLD1:'3', FLD2:'C'});
        while(!rs.EOF){
            log(rs.FLD1, rs.FLD2, rs.FLD3);
            rs.next();
        }
        ddd.query('SELECT * FROM TBL1');

        // rs = await ddd.select('TBL1', ['FLD1', 'FLD2'], {'FLD1': 'A', 'FLD2': null}, 'FLD1', 'FLD1', {'FLD1': 'A'});
        // rs = await ddd.select('TBL1', ['FLD1', 'FLD2'], {'FLD1': 'A', 'FLD2': null}, 'FLD1');
        rs = await ddd.select('TBL1', ['FLD1', 'FLD2'], {'FLD1': '2'}, 'FLD1');
        // rs = await ddd.select('TBL1', ['FLD1', 'FLD2']);
        log(rs.rows);
        // await ddd.insert('TBL1', {'FLD1': '4','FLD2': 'D','FLD3': 'jkl'});
        // await ddd.update('TBL1', {'FLD1': '1x', 'FLD2': 'Ax'}, {'FLD1': '1', 'FLD2': 'A'});
        // await ddd.delete('TBL1', {'FLD1': '3', 'FLD2': 'C'});
        // const ret = await ddd.get('TBL1', 'FLD2', {'FLD1': '2'});
        // log(ret);
        // await ddd.set('TBL1', {'FLD2': 'D','FLD3': 'jkl'}, {'FLD1': '4'});

        return 0; // returns.errorCode
    }

}
