const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Get login route
router
    .route('/login')
    .get(authController.loginForm)
    .post(authController.login);

// Logout
router.get('/logout', authController.logout);

router
    .route('/forgot-password')
    .get(authController.forgotForm)
    .post(authController.forgotPassword);

router
    .route('/reset/:token')
    .get(authController.reset)
    .post(authController.resetPassword);

module.exports = router;