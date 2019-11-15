'use strict'

const _ = require('lodash');
const typeOf = require('typeof');

module.exports = class Utils {

    static dump(obj){
        let dumpStr = '';
        switch (typeOf(obj)) {
            case 'dataset':
                _.forIn(obj, function(val, key) {
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

}