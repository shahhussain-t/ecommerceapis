const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');
const jwtMiddleware = require('../Middleware/jwtMiddleware');
const {verifyToken}=require('../Middleware/jwtMiddleware')
router.post('/createProduct',productController.createProduct);
router.put('/productStatus/:id', productController.updateAndComeback);
router.get('/getProduct/:id', productController.getProduct);

module.exports = router;
