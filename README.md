data-domain-driver
====
DDD: Data Domain Driver, Alternative \*\*Legacy\*\* Stored Procedures

## Installation
```
$ npm install data-domain-driver
```

## Usage
```javascript
// test.js
const DDD = new (require('data-domain-driver').DDD)();

returns = await DDD.callProcedure('proc01', params);
returns = await DDD.domain('another').callProcedure('procA', params);

DDD.end();
```
```javascript
// proc01.js
const Procedure = require('data-domain-driver').Procedure;

Class proc01 extends Procedure {

  async process(ddd, params, returns){
    
    // sql-behind named SQL statement or raw SQL string can be specified
    rs1 = await ddd.query('query1', {FLD1:'1', FLD2:'A'});

    while(!rs1.EOF){
      
      console.log(rs1.FLD1 + ', ' + rs1.FLD2 + ', ' + rs1.FLD3);
      
      rs1.next();
    }

    await ddd.execute('stmt2', {FLD1:'1', FLD2:'A', FLD3:'zzz'});

    await ddd.database('mydb2').execute('stmt1', params);

    rs2 = await ddd.database('webapi3').execute('stmt1', params);

    ret1 = await ddd.callFunction('func01', params);

    returns.result1 = rs1;
    returns.result2 = rs2;
    
    return 0; // returns.returnCode
  }

}
```
```SQL
-- proc01.sql
/**
 * @name query1
 * @desc Get data from TBL1
 * @param :FLD1 - Search condition of FLD1
 * @param :FLD2 - Search condition of FLD2
 * @return TBL1 result set
 */
SELECT
  FLD1
 ,FLD2
 ,FLD3
FROM TBL1
WHERE FLD1 = :FLD1
  AND FLD2 = :FLD2
```
```javascript
// func01.js
const Function = require('data-domain-driver').Function;

Class func01 extends Function {
  
  async process(ddd, params, returns){

    returns.resultA = params;

    return 0; // returns.returnCode
  }
  
}
```
## One Table Query Builder
```javascript
// procA.js
const Procedure = require('data-domain-driver').Procedure;

Class procA extends Procedure {

  async process(ddd, params, returns){
    
    // ddd.select(tblId, selClas, wheClas, ordClas, grpClas, havClas)
    rs = await ddd.select('TBL1', ['FLD1', 'FLD2'], {FLD1: '2'}, 'FLD1');

    // ddd.insert(tblId, insClas)
    await ddd.insert('TBL1', {FLD1: '4', FLD2: 'D', FLD3: 'jkl'});

    // ddd.update(tblId, updClas, wheClas)
    await ddd.update('TBL1', {FLD1: '1x', FLD2: 'Ax'}, {FLD1: '1', FLD2: 'A'});

    // ddd.delete(tblId, wheClas)
    await ddd.delete('TBL1', {FLD1: '3', FLD2: 'C'});

    // ddd.get(tblId, selClas, wheClas, ordClas, grpClas, havClas)
    v = await ddd.get('TBL1', 'FLD2', {FLD1: '2'});

    // ddd.set(tblId, setClas, wheClas)
    await ddd.set('TBL1', {FLD2: 'D', FLD3: 'jkl'}, {FLD1: '4'});

    return 0; // returns.returnCode
  }

}
```
## DataSet Anything Mapping
```javascript
// test.js
const DDD = new (require('data-domain-driver').DDD)();
returns = await DDD.callProcedure('proc01', params);
DDD.end();

// DataSet.toJSON(
//   mainDataDef     -  'jsonName=dataName[keyName]'
//   ,relationDefs   -  {'relationName': 'dataName[keyName]'}
// )
ordJson = returns.toJSON('orders=ORDERS[ORDER_ID]', {'details': 'DETAILS[ORDER_ID]'});

// DataSet.toObject(
//   mainDataDef     -  'className=dataName[keyName]'
//   ,relationDefs   -  {'relationName': 'className=dataName[keyName]'}
// )
ordObj = returns.toObject('Order=ORDERS[ORDER_ID]', {'details': 'Detail=DETAILS[ORDER_ID]'});
```
```javascript
// Order.js
const Model = require('data-domain-driver').Model;

module.exports = class Order extends Model {

    // constructor(data){
    //     super(data);
    // }
    
    get data(){
        return super.data;
    }
    
    set data(data){
        super.data = data;
        // Write custom data setting if needed
    }

    // Write domain logic here

}
```

## Licence

[MIT](http://opensource.org/licenses/mit-license.php)

## Author

[nmrmsys](https://github.com/nmrmsys)