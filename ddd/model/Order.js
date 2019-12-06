'use strict'
const Model = require('data-domain-driver').Model;

module.exports = class Order extends Model {

    // constructor(data){
    //     super(data);
    // }
    
    get data(){
        return super.data;
    }
    
    set data(data){
        super.data = data;
        // Write custom data setting if needed
    }

    // Write domain logic here

}