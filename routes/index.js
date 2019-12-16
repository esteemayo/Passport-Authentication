const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');

// CONTROLLERS
const index = require('../controllers/index');
const dashboard = require('../controllers/dashboad');

// GET INDEX ROUTE
router.get('/', index);

// GET DASHBOARD ROUTE
router.get('/dashboard', ensureAuthenticated, dashboard);

module.exports = router;