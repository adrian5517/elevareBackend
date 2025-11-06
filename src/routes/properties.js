const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

// Protect all routes
router.use(protect);

// Property routes
router.route('/')
  .get(getProperties)
  .post(authorize('landlord', 'property-manager', 'admin'), createProperty);

router.route('/:id')
  .get(getProperty)
  .put(authorize('landlord', 'property-manager', 'admin'), updateProperty)
  .delete(authorize('landlord', 'admin'), deleteProperty);

module.exports = router;
