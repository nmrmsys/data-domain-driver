// var Function = require('data-domain-driver').Function;
var Function = require('../../index').Function;

module.exports = class func01 extends Function {

    async process(ddd, params, returns) {

        console.log('func01 process');

        return 0; // returns.errorCode
    }

}
