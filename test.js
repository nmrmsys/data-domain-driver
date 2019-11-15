
const config = require('config');
const config_ddd = config.util.toObject(config.get('ddd'));
// const DDD = new (require('data-domain-driver').DDD)(config_ddd);
const DDD = new (require('./index').DDD)(config_ddd);

async function main(){
    returns = await DDD.callProcedure('proc01', {prm1:'a', prm2: 'b'});
    returns = await DDD.domain('another').callProcedure('procA', {});
    // DDD._.each([4,5,6],function(v){console.log(v);});
    DDD.end();
}

main();
