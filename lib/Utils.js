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

    static toJSON(dat){
        let jsonStr = '';
        switch (typeOf(dat)) {
            case 'dataset':
                jsonStr += '{';
                _.forIn(dat, function(val, key) {
                    // console.log(key + ': ' + typeOf(val));
                    if(jsonStr != '{'){
                        jsonStr += ',\n';
                    }
                    switch (typeOf(val)) {
                        case 'resultset':
                            jsonStr += '"' + key + '": ' + Utils.toJSON(val);
                            break;
                        default:
                            jsonStr += '"' + key + '": ' + JSON.stringify(val);
                            break;
                    }
                });
                jsonStr += '}';
                break;
            case 'resultset':
                const rows = dat.rows;
                jsonStr = '[\n';
                for(var i = 0; i < rows.length; i++){
                    if(i != 0){
                        jsonStr += ',\n';
                    }
                    // jsonStr += '  ' + JSON.stringify(rows[i]);
                    jsonStr += '  ' + JSON.stringify(rows[i]);
                }
                jsonStr += '\n]';
                break;
            default:
                jsonStr += JSON.stringify(dat);
                break;
        }
        return jsonStr;
    }

    static toObject(cls, dat){
        let obj;
        // const clsName = cls.match(/.*\/(.*)/)[1];
        switch (typeOf(dat)) {
            case 'dataset':
                throw new Error('toObject method DataSet not Supported');
                break;
            case 'resultset':
                obj = Utils.arrayToObject(cls, dat.rows);
                break;
            case 'array':
                obj = Utils.arrayToObject(cls, dat);
                break;
            default:
                let clsPath = cls;
                if(cls.charAt(0) != '.'){
                    const DDD = this._DDD;
                    if(DDD){
                        if(DDD._domain == 'default')
                            clsPath = DDD._dddPath() + DDD._paths.model + '/' + cls;
                        else
                            clsPath = DDD._dddPath() + DDD._domain + '/' + DDD._paths.model + '/' + cls;
                    } else {
                        clsPath = require('app-root-path') + '/' + cls;
                    }
                }
                // console.log('clsPath:' + clsPath);
                obj = new (require(clsPath))(dat);
                // obj.data = dat;
                break;
        }
        return obj;
    }

    static arrayToObject(cls, ary){
        let obj;
        if(ary.length == 0)
            throw new Error('toObject no data found');
        if(ary.length == 1){
            obj = Utils.toObject(cls, ary[0]);
        } else {
            obj = [];
            _.each(ary, (val) => { obj.push(Utils.toObject(cls, val)) });
        }
        return obj;
    }

    static data2prop(dat){
        return _.mapKeys(dat, _.rearg(_.camelCase, 1));
    }

    static setDDD(DDD){
        this._DDD = DDD;
    }

}