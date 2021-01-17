var mongoose = require('mongoose');  
const {v4 : uuidv4} = require('uuid') 
var EcartSchema = new mongoose.Schema({  
  cartId:{type:String,default:uuidv4(),index:true},
  item: String,
  orderCount: Number,
  price: Number,
  discount: Number,
});
mongoose.model('Ecart', EcartSchema);

module.exports = mongoose.model('Ecart');