const DDD = require('./lib/DDDOuter');
const ddd = require('./lib/dddInner');
const Procedure = require('./lib/Procedure');
const Function = require('./lib/Function');
const DataSet = require('./lib/DataSet');
const ResultSet = require('./lib/ResultSet');
const Model = require('./lib/Model');
const Utils = require('./lib/Utils');
const DDDRunner = require('./lib/DDDRunner');
const Task = require('./lib/Task');

module.exports = {
     DDD: DDD
    ,ddd: ddd
    ,Procedure: Procedure
    ,Function: Function
    ,ResultSet: ResultSet
    ,DataSet: DataSet
    ,Utils: Utils
    ,Model: Model
    ,DDDRunner: DDDRunner
    ,Task: Task
}