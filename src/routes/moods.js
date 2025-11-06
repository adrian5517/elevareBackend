const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getMoodEntries,
  createMoodEntry,
  getDailyAnalysis,
  getWeeklyTrends
} = require('../controllers/moodController');

// Protect all routes
router.use(protect);

// Mood entry routes
router.route('/')
  .get(getMoodEntries)
  .post(createMoodEntry);

router.get('/daily-analysis', getDailyAnalysis);
router.get('/weekly-trends', getWeeklyTrends);

module.exports = router;
