const express = require('express');
const router = express.Router();

// CONTROLLERS
const login = require('../controllers/login');
const loginLogic = require('../controllers/loginLogic');
const logout = require('../controllers/logout');

// GET LOGIN ROUTE
router.get('/login', login);

// LOGIN HANDLE
router.post('/login', loginLogic);

// LOGOUT HANDLE
router.get('/logout', logout);

module.exports = router;