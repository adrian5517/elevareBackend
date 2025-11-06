const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientName: { type: String, required: true },
  email: String,
  phone: { type: String, required: true },
  status: { type: String, enum: ['new','contacted','qualified','negotiating','won','lost'], default: 'new' },
  source: { type: String, enum: ['website','referral','social-media','walk-in','cold-call','other'], default: 'other' },
  interestedIn: { type: String, enum: ['buying','renting','selling'], required: true },
  budget: { min: Number, max: Number, currency: { type: String, default: 'PHP' } },
  preferences: { location: [String], propertyType: [String], bedrooms: Number, timeline: String },
  notes: [String],
  lastContact: Date,
  nextFollowUp: Date,
  priority: { type: String, enum: ['low','medium','high','urgent'], default: 'medium' },
  vipLead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = require('mongoose').models.Lead || mongoose.model('Lead', leadSchema);
