const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const jwtMiddleware = require('../Middleware/jwtMiddleware');

router.post('/createUser', authController.createUser);
router.post('/login', authController.verfiyToken,authController.login);

module.exports = router;
