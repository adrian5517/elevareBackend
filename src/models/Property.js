const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  address: { street: String, city: String, state: String, zipCode: String, country: { type: String, default: 'Philippines' } },
  type: { type: String, enum: ['apartment','house','condo','commercial','land'] },
  status: { type: String, enum: ['vacant','occupied','maintenance','listed'], default: 'vacant' },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = require('mongoose').models.Property || mongoose.model('Property', propertySchema);
