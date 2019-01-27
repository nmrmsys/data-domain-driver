// const proc01 = require('./ddd/proc01');
// const obj = new proc01();
// obj.call({});

// const proc01 = new (require('./ddd/proc01'))();
// proc01.call({});

// const DDD = new (require('data-domain-driver').DDD)();
// const DDD = new (require('./index').DDD)();
const config = require('config');
const config_ddd = config.util.toObject(config.get('ddd'));
const DDD = new (require('./index').DDD)(config_ddd);

async function main(){
    returns = await DDD.callProcedure('proc01', {});
    returns = await DDD.domain('another').callProcedure('procA', {});
}

main();
