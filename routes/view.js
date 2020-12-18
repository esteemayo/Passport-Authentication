const express = require('express');
const viewController = require('../controllers/viewController');
const { ensureAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// Get index route
router.get('/', viewController.index);

// Get dashboard route
router.get('/dashboard',
    ensureAuthenticated,
    viewController.dashboard
);

module.exports = router;