
// const config = require('config');
// const config_ddd = config.util.toObject(config.get('ddd'));
// const DDD = new (require('data-domain-driver').DDD)();
const DDD = new (require('./index').DDD)();

async function main(){
    returns = await DDD.callProcedure('proc01', {prm1:'a', prm2: 'b'});
    // returns = await DDD.callProcedure('sub/proc01', {prm1:'a', prm2: 'b'});
    console.log('returns.toJSON ' + returns.toJSON('order=RS'));
    console.log('returns.toObject %O', returns.toObject('Order=RS'));

    returns = await DDD.domain('another').callProcedure('procA', {});

    // _.each([4,5,6],function(v){console.log(v);});

    DDD.end();
}

main();
