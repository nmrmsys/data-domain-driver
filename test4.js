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
console.log('%O', Utils.toObject('../ddd/model/Order',{a:1,b:2}));
