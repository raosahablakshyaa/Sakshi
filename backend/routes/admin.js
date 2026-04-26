const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question');
const Progress = require('../models/Progress');
const CurrentAffairs = require('../models/CurrentAffairs');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// Platform stats
router.get('/stats', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [totalUsers, totalStudents, totalQuestions, totalArticles, todayActive] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      Question.countDocuments({ isActive: true }),
      CurrentAffairs.countDocuments({ isActive: true }),
      Progress.countDocuments({ date: today, $or: [{ questionsAttempted: { $gt: 0 } }, { studyMinutes: { $gt: 0 } }] })
    ]);
    res.json({ totalUsers, totalStudents, totalQuestions, totalArticles, todayActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = role ? { role } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort('-createdAt').skip(skip).limit(parseInt(limit)),
      User.countDocuments(query)
    ]);
    res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle user active status
router.patch('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get top performers
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({ role: 'student', isActive: true })
      .select('name avatar streak totalQuestionsAttempted totalCorrect currentClass')
      .sort('-streak -totalCorrect').limit(10);
    res.json(users.map((u, i) => ({
      rank: i + 1,
      name: u.name,
      avatar: u.avatar,
      streak: u.streak,
      totalQuestions: u.totalQuestionsAttempted,
      accuracy: u.totalQuestionsAttempted > 0 ? Math.round((u.totalCorrect / u.totalQuestionsAttempted) * 100) : 0,
      currentClass: u.currentClass
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
