'use strict'

const _ = require('lodash');

module.exports = class ResultSet {

    constructor(rows) {
        this._rows = rows;
        this._setRow(1);
    }

    _setRow(row){
        if(this._rows.length > 0){
            if(row <= this._rows.length){
                this.row = row;
                this.EOF = false;
            } else {
                this.EOF = true;
            }
        } else {
            this.row = 0;
            this.EOF = true;
        }
        const flds = this._rows[row - 1];
        const self = this;
        _.each(flds, function(val, key){
            self[key] = val;
        });
    }

    next() {
        this._setRow(this.row + 1);
    }

}
