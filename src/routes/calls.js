const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const {
  getCalls,
  getCall,
  createCall,
  addCoachFeedback,
  deleteCall
} = require('../controllers/callController');

// Protect all routes
router.use(protect);

// Call routes
router.route('/')
  .get(getCalls)
  .post(authorize('agent', 'manager', 'admin'), createCall);

router.route('/:id')
  .get(getCall)
  .delete(authorize('manager', 'admin'), deleteCall);

router.route('/:id/feedback')
  .post(authorize('manager', 'coach', 'admin'), addCoachFeedback);

module.exports = router;
