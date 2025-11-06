const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number },
  currency: { type: String, default: 'PHP' },
  type: { type: String, default: 'rent' },
  status: { type: String, default: 'pending' },
  dueDate: Date,
  paidDate: Date
}, { timestamps: true });

module.exports = require('mongoose').models.Payment || mongoose.model('Payment', paymentSchema);
