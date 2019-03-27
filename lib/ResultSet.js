'use strict'

const _ = require('lodash');
const typeOf = require('typeof');

module.exports = class ResultSet {

    constructor(data) {
        switch (typeOf(data)) {
            case 'array':
                this.rows = data;
                this.count = data.length;
                break;
            case 'string':
                this.rows = this.csv2json(data);
                this.count = this.rows.length;
                break;
            default:
                break;
        }
        this.first();
    }

    csv2json(csv, columnNames){
        let lines = _.compact(csv.split(/\n\r|\r|\n/));
        if(!columnNames){
            columnNames = _.head(lines).split(',');
            lines = _.tail(lines);
        }
        const rowArray = _.invokeMap(lines, String.prototype.split, ',');
        
        return _.map(rowArray, function(rowData) {
            return _.zipObject(columnNames, rowData);
        });
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
                this.columnIndex = _.zipObject(this.columnNames, _.range(this.columnNames.length));
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

}
