// const config = require('config');
// const config_ddd = config.util.toObject(config.get('ddd'));
// const DDD = new (require('data-domain-driver').DDD)();
const DDD = new (require('./index').DDD)();

async function main(){
    returns = await DDD.callProcedure('proc02', {prm1:'1', prm2: 'A'});
    DDD.end();
}

main();
