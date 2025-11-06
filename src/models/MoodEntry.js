const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entryType: { type: String, enum: ['morning','midday','after-call','end-of-day'], required: true },
  date: { type: Date, default: Date.now },
  mood: { type: Number, min: 1, max: 10 },
  energy: { type: Number, min: 1, max: 10 },
  focus: { type: Number, min: 1, max: 10 },
  confidence: { type: Number, min: 1, max: 5 },
  empathy: { type: Number, min: 1, max: 5 },
  satisfaction: { type: Number, min: 1, max: 5 },
  intention: String,
  reflection: String,
  aiCorrelation: { insights: [String], patterns: [String], recommendations: [String] }
}, { timestamps: true });

module.exports = require('mongoose').models.MoodEntry || mongoose.model('MoodEntry', moodEntrySchema);
