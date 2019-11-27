// var Function = require('data-domain-driver').Function;
var Function = require('../../index').Function;

module.exports = class func01 extends Function {

    async process(ddd, params, returns) {

        log('func01 process');
        var rs = await ddd.query('select * from tbl1');

        return 0; // returns.returnCode
    }

}
