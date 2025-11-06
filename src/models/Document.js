const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'lease-agreement',
      'id',
      'ownership-document',
      'tax-declaration',
      'insurance',
      'inspection-report',
      'maintenance-record',
      'other'
    ],
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileName: String,
  fileSize: Number, // in bytes
  mimeType: String,
  expiryDate: Date,
  alertBefore: {
    type: Number,
    default: 30 // days before expiry
  },
  tags: [String],
  isConfidential: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = require('mongoose').models.Document || mongoose.model('Document', documentSchema);
