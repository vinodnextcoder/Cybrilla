const { body, validationResult } = require('express-validator');
router.post('/addProduct',addItem)
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
    let productDiscount = calData(products)
    if (productDiscount.length > 0) {
      res.status(200).send(productDiscount);
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
module.exports = router;





