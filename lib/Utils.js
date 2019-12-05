'use strict'

const _ = require('lodash');
const typeOf = require('typeof');

module.exports = class Utils {

    static dump(obj){
        let dumpStr = '';
        switch (typeOf(obj)) {
            case 'dataset':
                _.forIn(obj, function(val, key) {
                    if(key != '_DDD') {
                        // console.log(key + ': ' + typeOf(val));
                        if(dumpStr != ''){
                            dumpStr += ',\n';
                        }
                        switch (typeOf(val)) {
                            case 'resultset':
                                dumpStr += key + ': ' + Utils.dump(val);
                                break;
                            default:
                                dumpStr += key + ': ' + JSON.stringify(val).replace(/"/g, '').replace(/,/g, ', ');
                                break;
                        }
                    }
                });
                break;
            case 'resultset':
                const rows = obj.rows;
                dumpStr = '[\n';
                for(var i = 0; i < rows.length; i++){
                    if(i != 0){
                        dumpStr += ',\n';
                    }
                    // dumpStr += '  ' + JSON.stringify(rows[i]);
                    dumpStr += '  ' + JSON.stringify(rows[i]).replace(/"/g, '').replace(/,/g, ', ');
                }
                dumpStr += '\n]';
                break;
            default:
                dumpStr += JSON.stringify(obj).replace(/"/g, '').replace(/,/g, ', ');
                break;
        }
        return dumpStr;
    }

    static _parseDataDef(def){
        let defName = '';
        let dataName = '';
        let keyName = '';
        let arTmp = def.split('=');
        if(arTmp.length == 2){
            defName = arTmp[0];
            dataName = arTmp[1];
        } else {
            dataName = arTmp[0];
            defName = dataName;
        }
        arTmp = dataName.split('[');
        if(arTmp.length == 2){
            dataName = arTmp[0];
            keyName = arTmp[1].replace(']','');
        } else {
            dataName = arTmp[0];
        }
        // console.log('defName:'+defName+' dataName:'+dataName+' keyName:'+keyName);
        return [defName, dataName, keyName];
    }

    static _getFilter(keyName, mainData, mainKeyName){
        if(keyName == '')
            return {};
        if(mainKeyName == '')
            mainKeyName = keyName;
        const keys = keyName.split(',');
        const vals = _.values(_.pick(mainData, mainKeyName.split(',')));
        return _.fromPairs(_.zip(keys, vals));
    }

    // toJSON(retuens: DataSet, 'details=DETAILS', {ORDER_ID: ''})
    static toJSON(dat, def, filter={}){
        let jsonStr = '', rows;
        switch (typeOf(dat)) {
            case 'dataset':
                if (typeof def != 'undefined') {
                    let [jsonName, dataName, keyName] = this._parseDataDef(def);
                    jsonName = _.camelCase(jsonName);
                    // console.log(jsonName + ',' + dataName + ',' + keyName);
                    let srcDat = dat[dataName];
                    if(jsonName == ''){
                        return Utils.toJSON(srcDat, def, filter);
                    } else {
                        return '"' + jsonName + '": ' + Utils.toJSON(srcDat, def, filter);
                    }
                } else {
                    jsonStr += '{';
                    _.forIn(dat, function(val, key) {
                        // console.log(key + ': ' + typeOf(val));
                        if(jsonStr != '{'){
                            jsonStr += ',\n';
                        }
                        jsonStr += '"' + _.camelCase(key) + '": ' + Utils.toJSON(val);
                    });
                    jsonStr += '}';
                }
                
                break;
            case 'resultset':
                rows = _.filter(dat.rows, filter);
                // rows = dat.rows;
                jsonStr = '[\n';
                for(var i = 0; i < rows.length; i++){
                    if(i != 0){
                        jsonStr += ',\n';
                    }
                    // jsonStr += '  ' + JSON.stringify(rows[i]);
                    jsonStr += '  ' + Utils.toJSON(rows[i]);
                }
                jsonStr += '\n]';
                break;
            case 'array':
                rows = _.filter(dat, filter);
                jsonStr = '[\n';
                for(var i = 0; i < rows.length; i++){
                    if(i != 0){
                        jsonStr += ',\n';
                    }
                    // jsonStr += '  ' + JSON.stringify(rows[i]);
                    jsonStr += '  ' + Utils.toJSON(rows[i]);
                }
                jsonStr += '\n]';
                break;
            case 'object':
                jsonStr += JSON.stringify(Utils.data2prop(dat));
                break;
            default:
                jsonStr += JSON.stringify(dat);
                break;
        }
        return jsonStr;
    }

    static _convClassName(className){
        const match = className.match(/(.*\/)(.*)/);
        if(match){
            return match[1] + _.chain(match[2]).camelCase().upperFirst().value();
        } else {
            return _.chain(className).camelCase().upperFirst().value();
        }
    }

    // toObject(retuens: DataSet, 'Detail=DETAILS', {ORDER_ID: ''})
    static toObject(dat, def, filter={}){
        let rows;
        if (typeof def != 'undefined'){
            let obj, className, dataName, keyName;
            if(typeOf(def) != 'array'){
                [className, dataName, keyName] = this._parseDataDef(def);
                className = this._convClassName(className);
                // console.log('2' + className + ',' + dataName + ',' + keyName);
            } else {
                [className, dataName, keyName] = def;
            }
            // console.log('className:'+className);
            switch (typeOf(dat)) {
                case 'dataset':
                    let srcDat = dat[dataName];
                    obj = Utils.toObject(srcDat, [className, dataName, keyName], filter);
                    break;
                case 'resultset':
                    rows = _.filter(dat.rows, filter);
                    obj = Utils.arrayToObject(rows, [className, dataName, keyName]);
                    break;
                case 'array':
                    rows = _.filter(dat, filter);
                    obj = Utils.arrayToObject(rows, [className, dataName, keyName]);
                    break;
                default:
                    let clsPath = className;
                    if(className.charAt(0) != '.'){
                        const DDD = this._DDD;
                        if(DDD){
                            if(DDD._domain == 'default')
                                clsPath = DDD._dddPath() + DDD._paths.model + '/' + className;
                            else
                                clsPath = DDD._dddPath() + DDD._domain + '/' + DDD._paths.model + '/' + className;
                        } else {
                            clsPath = require('app-root-path') + '/' + className;
                        }
                    }
                    // console.log('clsPath:' + clsPath);
                    obj = new (require(clsPath))(dat);
                    // obj.data = dat;
                    break;
            }
            return obj;
        } else {
            throw new Error('Util.toObject method DataSet specified dataDef param required');
        }
    }

    static arrayToObject(ary, def){
        let obj;
        if(ary.length == 0)
            throw new Error('toObject no data found');
        if(ary.length == 1){
            obj = Utils.toObject(ary[0], def);
        } else {
            obj = [];
            _.each(ary, (val) => { obj.push(Utils.toObject(val, def)) });
        }
        return obj;
    }

    static data2prop(dat, filter={}){
        const outDat = [];
        switch (typeOf(dat)) {
            case 'resultset':
                _.each(_.filter(dat.rows, filter), (val) => {
                    outDat.push(_.mapKeys(_.omit(val, _.keys(filter)), _.rearg(_.camelCase, 1)));
                });
                return outDat;
                break;
            case 'array':
                _.each(_.filter(dat, filter), (val) => {
                    outDat.push(_.mapKeys(_.omit(val, _.keys(filter)), _.rearg(_.camelCase, 1)));
                });
                return outDat;
                break;
            default:
                return _.mapKeys(_.omit(dat, _.keys(filter)), _.rearg(_.camelCase, 1));
                break;
        }
    }

    static setDDD(DDD){
        this._DDD = DDD;
    }

}