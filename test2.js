
var ResultSet = require('./lib/ResultSet');

// var rs = new ResultSet([{FLD1:'a', FLD2:'b', FLD3:'c'}]);
var rs = new ResultSet(`
FLD1,FLD2,FLD3
a,b,c
d,e,f
`);

console.log(rs);

