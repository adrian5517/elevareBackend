const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getDocuments,
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument
} = require('../controllers/documentController');

// Protect all routes
router.use(protect);

// Document routes
router.route('/')
  .get(getDocuments)
  .post(upload.single('file'), uploadDocument);

router.route('/:id')
  .get(getDocument)
  .put(updateDocument)
  .delete(deleteDocument);

module.exports = router;
