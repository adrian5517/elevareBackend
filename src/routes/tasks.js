const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  resolveTask,
  deleteTask
} = require('../controllers/taskController');

// Protect all routes
router.use(protect);

// Task routes
router.route('/')
  .get(getTasks)
  .post(authorize('manager', 'admin'), createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(authorize('manager', 'admin'), deleteTask);

router.put('/:id/resolve', resolveTask);

module.exports = router;
