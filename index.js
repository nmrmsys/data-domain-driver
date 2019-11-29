const DDD = require('./lib/DDDOuter');
const ddd = require('./lib/dddInner');
const Procedure = require('./lib/Procedure');
const Function = require('./lib/Function');
const DataSet = require('./lib/DataSet');
const ResultSet = require('./lib/ResultSet');
const Model = require('./lib/Model');
const Utils = require('./lib/Utils');

module.exports = {
     DDD: DDD
    ,ddd: ddd
    ,Procedure: Procedure
    ,Function: Function
    ,ResultSet: ResultSet
    ,DataSet: DataSet
    ,Utils: Utils
    ,Model: Model
}