const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../model/User');

// CONTROLLERS
const register = require('../controllers/register');
const registerLogic = require('../controllers/registerLogic');

// GET REGISTER ROUTE
router.get('/register', register);

// REGISTER HANDLE
router.post('/register', registerLogic);

module.exports = router;