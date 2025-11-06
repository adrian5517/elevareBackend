const MoodEntry = require('../models/MoodEntry');
const mongoose = require('mongoose');

// @desc    Get all mood entries
// @route   GET /api/v1/moods
// @access  Private
exports.getMoodEntries = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }
    
    const moodEntries = await MoodEntry.find({ agent: req.user.id }).sort({ date: -1 });
    res.status(200).json({ success: true, count: moodEntries.length, data: moodEntries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create mood entry
// @route   POST /api/v1/moods
// @access  Private
exports.createMoodEntry = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }
    
    req.body.agent = req.user.id;
    const moodEntry = await MoodEntry.create(req.body);
    res.status(201).json({ success: true, data: moodEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get daily analysis
// @route   GET /api/v1/moods/daily-analysis
// @access  Private
exports.getDailyAnalysis = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEntries = await MoodEntry.find({
      agent: req.user.id,
      date: { $gte: today }
    });
    
    res.status(200).json({ success: true, data: todayEntries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get weekly trends
// @route   GET /api/v1/moods/weekly-trends
// @access  Private
exports.getWeeklyTrends = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weekEntries = await MoodEntry.find({
      agent: req.user.id,
      date: { $gte: oneWeekAgo }
    }).sort({ date: 1 });
    
    res.status(200).json({ success: true, data: weekEntries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
