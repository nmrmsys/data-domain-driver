'use strict'

const _ = require('lodash');
const Utils = require('./Utils');

module.exports = class DataSet {

    // constructor(data) {
    //     _.assign(this, data);
    // }

    toJSON(
        mainDataDef   // 'dataName[keyName]'
        ,relationDefs // {'relationName': 'dataName[keyName]'}
    ){
        // json = 'orders: ' + returns.toJSON('ORDERS[ORDER_ID]', {'details': 'DETAILS[ORDER_ID]'});
        console.log('DataSet.toJSON');
    }

    toObject(
        mainDataDef   // 'className=dataName[keyName]'
        ,relationDefs // {'relationName': 'className=dataName[keyName]'}
    ){
        // orders = returns.toObject('Order=ORDERS[ORDER_ID]', {'details': 'Detail=DETAILS[ORDER_ID]'});
        console.log('DataSet.toObject');
    }

    dump(){
        return Utils.dump(this);
    }

}