const Call = require('../models/Call');
const mongoose = require('mongoose');

// @desc    Get all calls
// @route   GET /api/v1/calls
// @access  Private
exports.getCalls = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }
    
    const calls = await Call.find({ agent: req.user.id }).populate('agent lead');
    res.status(200).json({ success: true, count: calls.length, data: calls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single call
// @route   GET /api/v1/calls/:id
// @access  Private
exports.getCall = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }
    
    const call = await Call.findById(req.params.id).populate('agent lead');
    if (!call) {
      return res.status(404).json({ success: false, message: 'Call not found' });
    }
    res.status(200).json({ success: true, data: call });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create call
// @route   POST /api/v1/calls
// @access  Private
exports.createCall = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }
    
    req.body.agent = req.user.id;
    const call = await Call.create(req.body);
    res.status(201).json({ success: true, data: call });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add coach feedback to call
// @route   PUT /api/v1/calls/:id/coach-feedback
// @access  Private (manager/ceo/admin)
exports.addCoachFeedback = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }
    
    const call = await Call.findById(req.params.id);
    if (!call) {
      return res.status(404).json({ success: false, message: 'Call not found' });
    }
    
    call.coachFeedback = {
      coachId: req.user.id,
      feedback: req.body.feedback,
      rating: req.body.rating,
      strengths: req.body.strengths || [],
      improvements: req.body.improvements || [],
      correctiveScripts: req.body.correctiveScripts || [],
      reviewedAt: Date.now()
    };
    
    await call.save();
    res.status(200).json({ success: true, data: call });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete call
// @route   DELETE /api/v1/calls/:id
// @access  Private
exports.deleteCall = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }
    
    const call = await Call.findByIdAndDelete(req.params.id);
    if (!call) {
      return res.status(404).json({ success: false, message: 'Call not found' });
    }
    res.status(200).json({ success: true, message: 'Call deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
