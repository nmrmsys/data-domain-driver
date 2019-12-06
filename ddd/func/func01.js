'use strict'
const Function = require('data-domain-driver').Function;

module.exports = class func01 extends Function {

    async process(ddd, params, returns) {

        log('func01 process');
        let rs = await ddd.query('select * from tbl1');

        return 0; // returns.returnCode
    }

}
