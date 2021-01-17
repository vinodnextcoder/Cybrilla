var mongoose = require('mongoose'); 
const {v4 : uuidv4} = require('uuid') 
var ProductSchema = new mongoose.Schema({  
  productId:{type:String},
  item: String,
  price: Number,
  qty: Number,
  status:String
});
mongoose.model('Product', ProductSchema);

module.exports = mongoose.model('Product');