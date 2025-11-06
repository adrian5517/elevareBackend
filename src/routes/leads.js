const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead
} = require('../controllers/leadController');

// Protect all routes
router.use(protect);

// Lead routes
router.route('/')
  .get(getLeads)
  .post(authorize('agent', 'manager', 'admin'), createLead);

router.route('/:id')
  .get(getLead)
  .put(authorize('agent', 'manager', 'admin'), updateLead)
  .delete(authorize('manager', 'admin'), deleteLead);

module.exports = router;
