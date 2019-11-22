'use strict'

module.exports = class Order {
    constructor(){
        this._data = {};
    }
    
    get data(){
        console.log('get data');
        return this._data;
    }
    
    set data(data){
        console.log('set data');
        this._data = data;
    }
}