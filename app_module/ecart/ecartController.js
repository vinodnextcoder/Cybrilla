
const { body, validationResult } = require('express-validator');
const {v4 : uuidv4} = require('uuid') 
let tempArray=[
  {
      "productId": "6601a76b-8980-485d-8339-80292c066061",
      "item": "A",
      "price": 30,
      "qty": 7,
      "status": "ACTIVE",
      "discountPercentage": 16.66,
      "discount": 4.998,
      "amountToBePaid": 25.002
  },
  {
      "productId": "79531b9c-81e6-47d4-a71d-321a1ebf5000",
      "item": "B",
      "price": 20,
      "qty": 7,
      "status": "ACTIVE",
      "discountPercentage": 16.66,
      "discount": 3.332,
      "amountToBePaid": 16.668
  },
  {
      "productId": "c79630a2-0f65-4e14-8b63-597bf9dbc8ec",
      "item": "C",
      "price": 50,
      "qty": 7,
      "status": "ACTIVE",
      "discountPercentage": 16.66,
      "discount": 8.33,
      "amountToBePaid": 41.67
  },
  {
      "productId": "06314906-be92-445c-b366-4800ab6f28b7",
      "item": "D",
      "price": 15,
      "qty": 2,
      "status": "ACTIVE",
      "discountPercentage": 16.66,
      "discount": 2.499,
      "amountToBePaid": 12.501
  }
]
router.post('/addTocart',addItem);
router.post('/readEcart',readItem);
function addItem(req, res) {
  async.waterfall([
    function (callback) {
      if (req.body && typeof req.body.cart === 'undefined' || req.body.cart.length == 0) {
        return res.status(400).send({ statusCode: 400, msg: "There was a problem finding the products.", data: null });
      }
      else {
        let ProductArray = req.body.cart.map(sweetItem => {
          return sweetItem.productId
        })
        ProductArray = [...new Set(ProductArray)];
        if (ProductArray) {
          let pipeline = [
            {
              '$match': {
                'status': 'ACTIVE',
                'productId': {
                  '$in': ProductArray
                }
              }
            }
          ]
          MONGO.PRODUCT.aggregate(pipeline, function (err, products) {
            if (err) return res.status(400).send({ statusCode: 400, msg: "There was a problem finding the products.", data: null });
            else {
              if (products){
                callback(null, products)
              }
              else{
                res.status(404).send({ statusCode: 404, msg: "No Record Found.", data: null });
              }
            }

          });
        }
        else {
          return res.status(400).send({ statusCode: 400, msg: "There was a problem finding the products.", data: null });
        }
      }
    },
    function (value, callback) {
      let prods = calData(value)
      _.each(prods, function (ele) {
        let obj = {
          item: ele.productId,
          cartId:uuidv4() ,
          orderCount: 1,
          price: ele.amountToBePaid,
          discount: ele.discount,
        }
        console.log(obj);
      });
      callback(null, prods);
    }
  ], function (err, result) {
    res.status(200).send(result);
  });
}

function readItem(req, res) {
  MONGO.ECART.find({}, function (err, products) {
    if (err) return res.status(500).send("There was a problem finding the products.");
    res.status(200).send(products);
});
}

function addItemSingle(req, res) {
  if (req.body && req.body.item && req.body.price && req.body.qty) {
    MONGO.ECART.create({
      item: req.body.item,
      orderCount: req.body.price,
      price: req.body.qty,
      discount: req.body.discount,
      status: "ACTIVE"
    },
      function (err, user) {
        if (err) return res.status(500).send("There was a problem registering the user`.");
        res.status(200).send({ auth: true, token: "add product." });
      });
  }
  else {
    return res.status(400).send({msg:"Missing Param."});
  }
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