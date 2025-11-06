const express = require('express');
const router = express.Router();
const { getAgentDashboard, getLandlordDashboard, getManagerDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/agent', protect, getAgentDashboard);
router.get('/landlord', protect, getLandlordDashboard);
router.get('/manager', protect, getManagerDashboard);

module.exports = router;
