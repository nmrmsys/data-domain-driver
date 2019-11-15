_ = require('lodash');
ResultSet = require('./lib/ResultSet');
DataSet = require('./lib/DataSet');

ds = new DataSet();

// ds = new DataSet();
// _.assign(ds, rtns);

rs1 = new ResultSet(`
FLD1,FLD2,FLD3
a,b,c
d,e,f
`);

rs2 = new ResultSet(`
FLD1,FLD2
1,2
3,4
`);

ds.rs1 = rs1;
ds.rs2 = rs2;
ds.returnCode = 0;
ds.returnCode2 = 0;

//console.log('%O', ds);
// console.log(rs1.dump());
// console.log(ds.dump());
// Utils = require('./lib/Utils');
// console.log(Utils.dump(ds));

ds.toJSON();
