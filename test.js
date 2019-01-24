// var proc01 = require('./ddd/proc01');
// var obj = new proc01();
// obj.call({});

// var proc01 = new (require('./ddd/proc01'))();
// proc01.call({});

// var DDD = new (require('data-domain-driver').DDD)();
// var DDD = new (require('./index').DDD)();
let config = require('config');
let DDD = new (require('./index').DDD)(config.ddd);
returns = DDD.callProcedure('proc01', {});
returns = DDD.domain('another').callProcedure('procA', {});
