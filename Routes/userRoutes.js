const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const jwtMiddleware = require('../Middleware/jwtMiddleware');

router.post('/createUser', userController.createUser);
router.post('/login', userController.login);
router.post('/verify', jwtMiddleware.verifyToken);

module.exports = router;
