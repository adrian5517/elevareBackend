const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment
} = require('../controllers/paymentController');

// Protect all routes
router.use(protect);

// Payment routes
router.route('/')
  .get(getPayments)
  .post(authorize('landlord', 'property-manager', 'admin'), createPayment);

router.route('/:id')
  .get(getPayment)
  .put(authorize('landlord', 'property-manager', 'admin'), updatePayment)
  .delete(authorize('admin'), deletePayment);

module.exports = router;
