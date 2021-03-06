const { body, validationResult } = require('express-validator');
router.post('/addProduct',addItem)
router.post('/addBulkItem',addBulkItem)
const {v4 : uuidv4} = require('uuid') 
function addItem(req, res) {
  if (req.body && req.body.item && req.body.price && req.body.qty) {
    let prod=new MONGO.PRODUCT({
      productId:uuidv4() ,
      item: req.body.item,
      price: req.body.price,
      qty: req.body.qty,
      status: "ACTIVE"
    })
    MONGO.PRODUCT.create(prod,
      function (err, item) {
        if (err) return res.status(500).send("There was a problem in add product.");
        res.status(200).send({ product: item, token: "add product." });
      });
  }
  else {
    return res.status(400).send({msg:"Missing Param."});
  }
}
router.post('/readProduct',readItem);
function readItem(req, res) {
  MONGO.PRODUCT.find({}, { _id: 0, __v: 0 }, function (err, products) {
    if (err) return res.status(500).send("There was a problem finding the products.");
    let productDiscount = products
    if (productDiscount.length > 0) {
      res.status(200).send({status:200,"msg": "sucess",productDiscount });
    }
    else {
      res.status(200).send({ "msg": "No data Found" });
    }
  }).lean();
}
function calData(products){
  let productDiscount = [];
  products.forEach(function (ele) {
    let discount = (ele.price * 16.66) / 100;
    let amountToBePaid = ele.price - discount;
    ele.discountPercentage = 16.66
    ele.discount = discount
    ele.amountToBePaid = amountToBePaid
    productDiscount.push(ele)
  })
  return productDiscount
}

function addBulkItem(req, res) {
  if (req.body && req.body.cart ) {
     console.log(req.body.cart)
     let insertArray=[]
     _.each(req.body.cart,function(ele){
      let prod=new MONGO.PRODUCT({
        productId:uuidv4() ,
        item: ele.item,
        price: ele.price,
        qty: ele.qty,
        status: "ACTIVE"
      })
      let inserObj = {
        insertOne: {
          "document": prod
        }
      }
      insertArray.push(inserObj);
     });
    MONGO.PRODUCT.bulkWrite(insertArray,
      function (err, item) {
        if (err){ return res.status(500).send("There was a problem in add product.");}
        else{
          res.status(200).send({status:200,msg:"Record inserted ",data:null});
        }
      });
  }
  else {
    return res.status(400).send({msg:"Missing Param."});
  }
}
module.exports = router;





