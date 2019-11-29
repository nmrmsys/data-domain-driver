// const Model = require('data-domain-driver').Model;
const Model = require('../../index').Model;

module.exports = class Order extends Model {

    // constructor(data){
    //     super(data);
    // }
    
    get data(){
        return super.data;
    }
    
    set data(data){
        super.data = data;
    }

}