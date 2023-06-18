const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');


router.post('/createUser', authController.createUser);
router.post('/login', authController.verfiyToken,authController.login);

module.exports = router;
