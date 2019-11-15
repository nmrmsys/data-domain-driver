'use strict'

const _ = require('lodash');
const typeOf = require('typeof');
const Utils = require('./Utils');

module.exports = class ResultSet {

    constructor(data, columnNames) {
        switch (typeOf(data)) {
            case 'array':
                this.rows = data;
                this.count = data.length;
                break;
            case 'string':
                let lines = _.compact(data.split(/\n\r|\r|\n/));
                if(!columnNames){
                    columnNames = _.head(lines).split(',');
                    lines = _.tail(lines);
                }
                this.columnNames = columnNames;
                this.columnIndex = _.zipObject(_.range(columnNames.length), columnNames);
                const rowArray = _.invokeMap(lines, String.prototype.split, ',');
                this.rows = _.map(rowArray, function(rowData) {
                    return _.zipObject(columnNames, rowData);
                });
                this.count = this.rows.length;
                break;
            default:
                break;
        }
        this.first();
    }

    move(row){
        if(this.count > 0){
            if(row < 1){
                this.row = 0;
                this.BOF = true;
                this.EOF = false;
            } else if(row > this.rows.length){
                this.row = 0;
                this.BOF = false;
                this.EOF = true;
            } else {
                this.row = row;
                this.BOF = false;
                this.EOF = false;
            }
        } else {
            this.row = 0;
            this.BOF = true;
            this.EOF = true;
        }
        if(row !== 0){
            const oRow = this.rows[row - 1];
            const self = this;
            _.each(oRow, function(val, key){
                self[key] = val;
            });
            if(!this.columnNames){
                this.columnNames = _.keys(oRow);
                this.columnIndex = _.zipObject(_.range(this.columnNames.length), this.columnNames);
            }
            this.columnValues = _.values(oRow);
        }
    }

    first() {
        this.move(1);
    }

    last() {
        this.move(this.count);
    }

    next() {
        this.move(this.row + 1);
    }

    previous() {
        this.move(this.row - 1);
    }

    getRow(row, columnNames) {
        if(row >= 1 && row <= this.count){
            if(columnNames){
                return _.pick(this.rows[row - 1], columnNames);
            } else {
                return this.rows[row - 1];
            }
        } else {
            // throw new Error('row not found');
            return null;
        }
    }

    setRow(row, oRow) {
        if(row >= 1 && row <= this.count){
            _.assign(this.rows[row - 1], oRow);
        } else {
            // throw new Error('row not found');
        }
    }

    addRow(oRow) {
        // TODO: col check?
        this.rows.push(oRow);
        this.count++;
    }

    getValue(row, col) {
        if(row >= 1 && row <= this.count){
            if(isNaN(col)) {
                return this.rows[row - 1][col];
            } else {
                return this.rows[row - 1][this.columnIndex[col - 1]];
            }
        } else {
            // throw new Error('row not found');
            return '';
        }
    }

    setValue(row, col, value) {
        if(row >= 1 && row <= this.count){
            if(isNaN(col)) {
                this.rows[row - 1][col] = value;
            } else {
                this.rows[row - 1][this.columnIndex[col - 1]] = value;
            }
        } else {
            // throw new Error('row not found');
        }
    }

    clone() {
        return new ResultSet(_.join(this.columnNames));
    }

    copy() {
        return new ResultSet(this.rows);
    }

    dump() {
        return Utils.dump(this);
    }
    
}
