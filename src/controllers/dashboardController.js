const User = require('../models/User');
const Lead = require('../models/Lead');
const Call = require('../models/Call');
const MoodEntry = require('../models/MoodEntry');
const Task = require('../models/Task');
const Property = require('../models/Property');
const Payment = require('../models/Payment');

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

exports.getAgentDashboard = async (req, res) => {
  try {
    const agentId = req.user.id;
    const today = new Date();
    today.setHours(0,0,0,0);

    const activeLeads = await Lead.countDocuments({ agent: agentId, status: { $in: ['new','contacted','qualified','negotiating'] } });
    const pendingTasks = 0; // minimal scaffold: tasks model not yet implemented here

    const todayCalls = await Call.find({ agent: agentId, callDate: { $gte: today } }).populate('lead', 'clientName');
    const recentMood = await MoodEntry.findOne({ agent: agentId }).sort({ createdAt: -1 });

    const completedTasksToday = 0;
    const totalTasksToday = pendingTasks + completedTasksToday;
    const progress = totalTasksToday > 0 ? Math.round((completedTasksToday / totalTasksToday) * 100) : 0;

    res.status(200).json({ success: true, data: { stats: { progress, activeLeads, pendingTasks, todayCallsCount: todayCalls.length }, recentCalls: todayCalls.slice(0,5), recentMood, greeting: getTimeBasedGreeting() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLandlordDashboard = async (req, res) => {
  try {
    const landlordId = req.user.id;
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const totalProperties = 0;
    const occupiedProperties = 0;
    const paidThisMonth = 0;
    const overduePayments = 0;
    const monthlyIncome = 0;
    const upcomingRenewals = [];

    res.status(200).json({ success: true, data: { stats: { totalProperties, occupiedProperties, vacantProperties: totalProperties - occupiedProperties, paidThisMonth, overduePayments, monthlyIncome }, upcomingRenewals } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getManagerDashboard = async (req, res) => {
  try {
    const managerId = req.user.id;
    const today = new Date();
    today.setHours(0,0,0,0);

    const teamAgents = await User.find({ role: 'agent' });
    const agentIds = teamAgents.map(a => a._id);

    const totalLeads = await Lead.countDocuments({ agent: { $in: agentIds } });
    const todayCalls = await Call.countDocuments({ agent: { $in: agentIds }, callDate: { $gte: today } });
    const pendingReviews = await Call.countDocuments({ agent: { $in: agentIds }, 'coachFeedback.coachId': { $exists: false } });

    const callsNeedingReview = await Call.find({ agent: { $in: agentIds }, 'coachFeedback.coachId': { $exists: false } }).populate('agent','fullName').populate('lead','clientName').sort({ createdAt: -1 }).limit(10);

    res.status(200).json({ success: true, data: { stats: { teamSize: teamAgents.length, totalLeads, todayCalls, pendingReviews }, callsNeedingReview } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
