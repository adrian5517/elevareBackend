const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  clientName: { type: String, required: true },
  duration: { type: Number, required: true },
  recordingUrl: String,
  transcription: { type: String, default: '' },
  sentiment: { type: String, enum: ['positive','neutral','negative','hesitant'], default: 'neutral' },
  aiAnalysis: { keyPoints: [String], detectedInterest: [String], missedOpportunities: [String], suggestedActions: [String], confidenceScore: Number },
  coachFeedback: {
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    feedback: String,
    rating: Number,
    strengths: [String],
    improvements: [String],
    correctiveScripts: [String],
    reviewedAt: Date
  },
  callDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = require('mongoose').models.Call || mongoose.model('Call', callSchema);
