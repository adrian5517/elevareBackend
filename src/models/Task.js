const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: 'pending' },
  priority: { type: String, default: 'medium' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  response: String,
  resolvedAt: Date
}, { timestamps: true });

module.exports = require('mongoose').models.Task || mongoose.model('Task', taskSchema);
