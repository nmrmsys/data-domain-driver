
var ResultSet = require('./lib/ResultSet');

// var rs = new ResultSet([{FLD1:'a', FLD2:'b', FLD3:'c'}]);
var rs = new ResultSet(`
FLD1,FLD2,FLD3
a,b,c
d,e,f
`);
console.log(rs);

// console.log(rs.getRow(3));
// rs.setRow(1, {FLD1: 'a1', FLD3: 'c3' });
// rs.addRow({FLD1: 'a1', FLD2: 'b2', FLD3: 'c3' });
// console.log(rs.getValue(2,2));
// rs.setValue(1,2,'x');
// console.log(rs.rows);
// console.log(rs.clone());
// console.log(rs.copy());
