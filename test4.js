_ = require('lodash');
ResultSet = require('./lib/ResultSet');
DataSet = require('./lib/DataSet');
Utils = require('./lib/Utils');

ds = new DataSet();

// ds = new DataSet();
// _.assign(ds, rtns);

RESULT_SET_1 = new ResultSet(`
FLD1,FLD2,FLD3
a,b,c
d,e,f
`);

rs2 = new ResultSet(`
FLD1,FLD2
1,2
3,4
`);

ds.RESULT_SET_1 = RESULT_SET_1;
ds.rs2 = rs2;
ds.returnCode = 0;
ds.returnCode2 = 0;

//console.log('%O', ds);
// console.log(RESULT_SET_1.dump());
// console.log(ds.dump());
// Utils = require('./lib/Utils');
// console.log(Utils.dump(ds));

// console.log(ds.toJSON());
// console.log(ds.toJSON('RESULT_SET_1'));
// console.log(ds.toJSON('rst=RESULT_SET_1[key]'));
// console.log('%O', ds.toObject());
// console.log('ddd/model/Order'.match(/.*\/(.*)/)[0]);
// console.log('%O', Utils.toObject('../ddd/model/Order',{FLD1:1,FLD2:2}));
// console.log('%O', Utils.toObject('../ddd/model/Order',rs2));
// console.log('%O', Utils.toObject('../ddd/model/Order', [{FLD1:'1',FLD2:'2'},{FLD1:'3',FLD2:'4'}]));
// console.log('%O', Utils.toObject('ddd/model/Order',{FLD1:1,FLD2:2}));
// console.log('%O', Utils.toObject('ddd/model/Order', [{FLD1:'1',FLD2:'2'},{FLD1:'3',FLD2:'4'}]));
const config = require('config');
const config_ddd = config.util.toObject(config.get('ddd'));
// const DDD = new (require('data-domain-driver').DDD)(config_ddd);
const DDD = new (require('./index').DDD)(config_ddd);
Utils.setDDD(DDD);
// console.log('%O', Utils.toObject('Order',{FLD1:1,FLD2:2}));
console.log('%O', Utils.toObject('Order',rs2));
