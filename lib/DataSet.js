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
        if(typeOf(this[dataName]) == 'resultset'){
            const filter = Utils._getFilter(keyName, mainData, mainKeyName);
            return Utils.data2prop(_.filter(this[dataName].rows,filter));
        } else {
            return this[dataName];
        }
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
            let mainDat = this[dataName];

            switch (typeOf(mainDat)) {
                case 'resultset':
                    _.each(mainDat.rows, (row) => {
                        _.each(relationDefs, (def, name) => {
                            row[name] = this._getRelationData(def, row, keyName);
                        });
                    });
                    break;
                case 'array':
                    _.each(mainDat, (row) => {
                        _.each(relationDefs, (def, name) => {
                            row[name] = this._getRelationData(def, row, keyName);
                        });
                    });
                    break;
                default:
                    _.each(relationDefs, (def, name) => {
                        mainDat[name] = this._getRelationData(def, mainDat, keyName);
                    });
                    break;
            }
            // console.log('%O',srcDat);

            if(jsonName == ''){
                return Utils.toJSON(mainDat);
            } else {
                return '"' + jsonName + '": ' + Utils.toJSON(mainDat);
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
            let mainDat = this[dataName];

            switch (typeOf(mainDat)) {
                case 'resultset':
                    _.each(mainDat.rows, (row) => {
                        _.each(relationDefs, (def, name) => {
                            row[name] = this._getRelationData(def, row, keyName);
                        });
                    });
                    break;
                case 'array':
                    _.each(mainDat, (row) => {
                        _.each(relationDefs, (def, name) => {
                            row[name] = this._getRelationData(def, row, keyName);
                        });
                    });
                    break;
                default:
                    _.each(relationDefs, (def, name) => {
                        mainDat[name] = this._getRelationData(def, mainDat, keyName);
                    });
                    break;
            }
            // console.log('%O',srcDat);

            Utils.setDDD(this._DDD);
            return Utils.toObject(mainDat, [className, dataName, keyName]);
        } else {
            throw new Error('DataSet.toObject method dataDef param required');
        }
    }

    dump(){
        return Utils.dump(this);
    }

}