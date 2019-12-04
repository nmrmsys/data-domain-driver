_ = require('lodash');
ResultSet = require('./lib/ResultSet');
DataSet = require('./lib/DataSet');
Utils = require('./lib/Utils');

ds = new DataSet();

// ds = new DataSet();
// _.assign(ds, rtns);

ORDERS = new ResultSet(`
ORDER_ID,NAME
1,aaa
2,bbb
3,ccc
`);

DETAILS = new ResultSet(`
DETAIL_ID,ORDER_ID,ITEM,QTY
1,1,xxx,1
2,1,yyy,2
3,1,zzz,3
4,2,xxx,4
5,2,yyy,5
6,3,zzz,6
`);

ds.ORDERS = ORDERS;
ds.DETAILS = DETAILS;
ds.returnCode = 0;
ds.returnCode2 = 0;

//console.log('%O', ds);
// console.log(ORDERS.dump());
// console.log(ds.dump());
// Utils = require('./lib/Utils');
// console.log(Utils.dump(ds));

// console.log(ds.toJSON());
// console.log(ds.toJSON('ORDERS'));
// console.log(ds.toJSON('rst=ORDERS[key]'));
// console.log('%O', ds.toObject());
// console.log('ddd/model/ORDERS'.match(/.*\/(.*)/)[0]);
// console.log('%O', Utils.toObject({FLD1:1,FLD2:2},'../ddd/model/ORDERS'));
// console.log('%O', Utils.toObject(DETAILS,'../ddd/model/ORDERS'));
// console.log('%O', Utils.toObject([{FLD1:'1',FLD2:'2'},{FLD1:'3',FLD2:'4'}],'../ddd/model/ORDERS'));
// console.log('%O', Utils.toObject({FLD1:1,FLD2:2},'ddd/model/ORDERS'));
// console.log('%O', Utils.toObject([{FLD1:'1',FLD2:'2'},{FLD1:'3',FLD2:'4'}],'ddd/model/ORDERS'));
// console.log('%O', Utils.toObject(ds));
// console.log('%O', Utils.toObject(ds,'ddd/model/ORDERS=DETAILS'));
// console.log('%O', Utils.toObject(ds,['ddd/model/ORDERS','DETAILS','']));

// console.log(Utils.toJSON(ds,'orders=ORDERS'));
// console.log(Utils.toJSON(ds,'orders=ORDERS',{ORDER_ID:'1'}));
// console.log('%O', Utils.toObject(ds,'ddd/model/Order=ORDERS',{ORDER_ID:'2'}));

console.log(ds.toJSON('orders=ORDERS[ORDER_ID]',{details:'DETAILS[ORDER_ID]'}));
console.log(ds.toObject('ddd/model/Order=ORDERS[ORDER_ID]',{details:'DETAILS[ORDER_ID]'}));
// console.log('%O', Utils.toObject(ORDERS,'ddd/model/Order'));
// console.log('%O', Utils._getFilter('', {fld1:1, fld2:2, fld3:3}, ''));

// const config = require('config');
// const config_ddd = config.util.toObject(config.get('ddd'));
// // const DDD = new (require('data-domain-driver').DDD)(config_ddd);
// const DDD = new (require('./index').DDD)(config_ddd);
// Utils.setDDD(DDD);
// // console.log('%O', Utils.toObject({FLD1:1,FLD2:2},'ORDERS'));
// console.log('%O', Utils.toObject(DETAILS,'ORDERS'));
// ds._DDD = DDD;
// console.log('%O', ds.toObject('ORDERS=DETAILS'));

