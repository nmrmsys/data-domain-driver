'use strict'

const _ = require('lodash');
const typeOf = require('typeof');
const Utils = require('./Utils');

module.exports = class DataSet {

    // constructor(data) {
    //     _.assign(this, data);
    // }
    _getRelationData(relationDef, mainData, mainKeyName){
        let [jsonName, dataName, keyName] = Utils._parseDataDef(relationDef);
        const filter = Utils._getFilter(keyName, mainData, mainKeyName);
        switch (typeOf(this[dataName])) {
            case 'resultset':
            case 'array':
                return Utils.data2prop(this[dataName], filter);
                break;
            default:
                return this[dataName];
                break;
        }
        if(typeOf(this[dataName]) == 'resultset'){
        } else {
        }
    }

    _getMainData(dataName, keyName, relationDefs){
        let mainData = this[dataName];
        switch (typeOf(mainData)) {
            case 'resultset':
                _.each(mainData.rows, (row) => {
                    _.each(relationDefs, (def, name) => {
                        row[name] = this._getRelationData(def, row, keyName);
                    });
                });
                break;
            case 'array':
                _.each(mainData, (row) => {
                    _.each(relationDefs, (def, name) => {
                        row[name] = this._getRelationData(def, row, keyName);
                    });
                });
                break;
            default:
                _.each(relationDefs, (def, name) => {
                    mainData[name] = this._getRelationData(def, mainData, keyName);
                });
                break;
        }
        // console.log('%O',mainData);
        return mainData;
    }

    toJSON(
        mainDataDef   // 'jsonName=dataName[keyName]'
        ,relationDefs // {'relationName': 'dataName[keyName]'}
    ){
        // json = 'orders: ' + returns.toJSON('ORDERS[ORDER_ID]', {'details': 'DETAILS[ORDER_ID]'});
        // console.log('DataSet.toJSON');
        if (typeof mainDataDef != 'undefined') {
            let [jsonName, dataName, keyName] = Utils._parseDataDef(mainDataDef);
            jsonName = _.camelCase(jsonName);
            // console.log(jsonName + ',' + dataName + ',' + keyName);

            let mainData = this._getMainData(dataName, keyName, relationDefs);

            if(jsonName == ''){
                return Utils.toJSON(mainData);
            } else {
                return '"' + jsonName + '": ' + Utils.toJSON(mainData);
            }
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
        // console.log('DataSet.toObject');
        if (typeof mainDataDef != 'undefined') {
            let [className, dataName, keyName] = Utils._parseDataDef(mainDataDef);
            className = Utils._convClassName(className);
            // console.log(className + ',' + dataName + ',' + keyName);

            let mainData = this._getMainData(dataName, keyName, relationDefs);

            Utils.setDDD(this._DDD);
            return Utils.toObject(mainData, [className, dataName, keyName]);
        } else {
            throw new Error('DataSet.toObject method dataDef param required');
        }
    }

    dump(){
        return Utils.dump(this);
    }

}