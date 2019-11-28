'use strict'

const _ = require('lodash');
const typeOf = require('typeof');
const Utils = require('./Utils');

module.exports = class DataSet {

    // constructor(data) {
    //     _.assign(this, data);
    // }

    toJSON(
        mainDataDef   // 'jsonName=dataName[keyName]'
        ,relationDefs // {'relationName': 'dataName[keyName]'}
    ){
        // json = 'orders: ' + returns.toJSON('ORDERS[ORDER_ID]', {'details': 'DETAILS[ORDER_ID]'});
        // console.log('DataSet.toJSON');
        if (typeof mainDataDef != 'undefined') {
            let jsonName = '';
            let dataName = '';
            let keyName = '';
            let arTmp = mainDataDef.split('=');
            if(arTmp.length == 2){
                jsonName = arTmp[0];
                dataName = arTmp[1];
            } else {
                dataName = arTmp[0];
            }
            arTmp = dataName.split('[');
            if(arTmp.length == 2){
                dataName = arTmp[0];
                keyName = arTmp[1].replace(']','');
            } else {
                dataName = arTmp[0];
            }
            if(jsonName == ''){
                jsonName = _.camelCase(dataName);
            }
            // console.log(jsonName + ',' + dataName + ',' + keyName);
            let srcDat = this[dataName];
            return '{"' + jsonName + '": ' + Utils.toJSON(srcDat) + '}';
        } else {
            // console.log('%O', this);
            return Utils.toJSON(this);
        }
    }

    toObject(
        mainDataDef   // 'className=dataName[keyName]'
        ,relationDefs // {'relationName': 'className=dataName[keyName]'}
    ){
        // orders = returns.toObject('Order=ORDERS[ORDER_ID]', {'details': 'Detail=DETAILS[ORDER_ID]'});
        console.log('DataSet.toObject');
        if (typeof mainDataDef != 'undefined') {
            let className = '';
            let dataName = '';
            let keyName = '';
            let arTmp = mainDataDef.split('=');
            if(arTmp.length == 2){
                className = arTmp[0];
                dataName = arTmp[1];
            } else {
                dataName = arTmp[0];
            }
            arTmp = dataName.split('[');
            if(arTmp.length == 2){
                dataName = arTmp[0];
                keyName = arTmp[1].replace(']','');
            } else {
                dataName = arTmp[0];
            }
            if(className == ''){
                className = _.camelCase(dataName);
            }
            let srcDat = this[dataName];
            Utils.setDDD(this._DDD);
            return Utils.toObject(className, srcDat);
        } else {
            throw new Error('toObject method DataSet not Supported');
        }
    }

    dump(){
        return Utils.dump(this);
    }

}