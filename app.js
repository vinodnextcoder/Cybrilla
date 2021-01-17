var express = require('express');
var app = express();
var db = require('./config/db');
global.__root   = __dirname + '/'; 

app.get('/api', function (req, res) {
  res.status(200).send('API works.');
});
app.get('/', function (req, res) {
  res.status(200).send('API works.');
});
global.router = express.Router();
global.MONGO = require("./lib/Schema/index")
global.async = require("async");
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var ProductController = require(__root + 'app_module/product/productController');
var ecartController = require(__root + 'app_module/ecart/ecartController');
app.use('/api/Product', ProductController);
app.use('/api/Ecart', ecartController);

module.exports = app;