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

returns = DDD.callProcedure('proc01', params);
returns = DDD.domain('another').callProcedure('procA', params);
```
```javascript
// proc01.js
var Procedure = require('data-domain-driver').Procedure;

Class proc01 extends Procedure {
  process(ddd, params, returns){
    
    // sql-behind named SQL statement or raw SQL string can be specified
    rs1 = ddd.query('query1', {FLD1:'1', FLD2:'A'});

    while(!rs1.EOF()){
      
      console.log(rs1.FLD1 + ', ' + rs1.FLD2 + ', ' + rs1.FLD3);
      
      rs1.next();
    }

    ddd.execute('stmt2', {FLD1:'1', FLD2:'A', FLD3:'zzz'});

    ddd.database('mydb2').execute('stmt1', params);

    rs2 = ddd.database('webapi3').execute('stmt1', params);

    ret1 = ddd.callFunction('func01', params);

    returns.result1 = rs1;
    returns.result2 = rs2;
    
    return 0; // returns.errorCode
  }
}
```
```javascript
// func01.js
var Function = require('data-domain-driver').Function;

Class func01 extends Function {
  process(ddd, params, returns){
    returns.resultA = params;
  }
}
```

## Licence

[MIT](http://opensource.org/licenses/mit-license.php)

## Author

[nmrmsys](https://github.com/nmrmsys)