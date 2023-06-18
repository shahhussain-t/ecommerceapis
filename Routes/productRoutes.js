const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');

router.post('/createProduct',productController.createProduct);
router.get('/getProduct/:id',productController.verfiyToken, productController.getProduct);
router.put('/updateProduct/:id',productController.verfiyToken,productController.updateProduct);
router.delete('/deleteProduct/:id',productController.verfiyToken,productController.deleteProduct)

module.exports = router;
