const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router
    .route('/register')
    .get(userController.registerForm)
    .post(
        userController.register,
        authController.login
    );

router
    .route('/verify')
    .get(userController.verifyForm)
    .post(userController.verify);

module.exports = router;