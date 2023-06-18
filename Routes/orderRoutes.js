const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');
const jwtMiddleware = require('../Middleware/jwtMiddleware');

router.post('/orderProduct',orderController.orderProduct);

module.exports = router;
