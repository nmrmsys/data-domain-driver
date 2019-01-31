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
var DDD = new (require('data-domain-driver').DDD)();

returns = await DDD.callProcedure('proc01', params);
returns = await DDD.domain('another').callProcedure('procA', params);

DDD.end();
```
```javascript
// proc01.js
var Procedure = require('data-domain-driver').Procedure;

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
    
    return 0; // returns.errorCode
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
var Function = require('data-domain-driver').Function;

Class func01 extends Function {
  
  async process(ddd, params, returns){

    returns.resultA = params;

    return 0; // returns.errorCode
  }
  
}
```

## Licence

[MIT](http://opensource.org/licenses/mit-license.php)

## Author

[nmrmsys](https://github.com/nmrmsys)