const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get today's progress
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let progress = await Progress.findOne({ userId: req.user._id, date: today });
    if (!progress) progress = new Progress({ userId: req.user._id, date: today });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get progress for last N days
router.get('/history', protect, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const from = new Date();
    from.setDate(from.getDate() - parseInt(days));
    const fromStr = from.toISOString().split('T')[0];
    const progress = await Progress.find({ userId: req.user._id, date: { $gte: fromStr } }).sort('date');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get full dashboard stats
router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = req.user;
    const today = new Date().toISOString().split('T')[0];
    const last30 = new Date();
    last30.setDate(last30.getDate() - 30);
    const last30Str = last30.toISOString().split('T')[0];

    const [todayProgress, monthProgress] = await Promise.all([
      Progress.findOne({ userId: user._id, date: today }),
      Progress.find({ userId: user._id, date: { $gte: last30Str } }).sort('date')
    ]);

    const totalAttempted = user.totalQuestionsAttempted || 0;
    const totalCorrect = user.totalCorrect || 0;
    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

    // Subject-wise accuracy from last 30 days
    const subjectStats = {};
    monthProgress.forEach(p => {
      p.subjectBreakdown.forEach(s => {
        if (!subjectStats[s.subject]) subjectStats[s.subject] = { attempted: 0, correct: 0 };
        subjectStats[s.subject].attempted += s.attempted;
        subjectStats[s.subject].correct += s.correct;
      });
    });

    const subjectArray = Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      attempted: stats.attempted,
      correct: stats.correct,
      accuracy: stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0
    })).sort((a, b) => b.attempted - a.attempted);

    const weakSubjects = subjectArray.filter(s => s.accuracy < 50).map(s => s.subject);
    const strongSubjects = subjectArray.filter(s => s.accuracy >= 70).map(s => s.subject);

    // Update user weak/strong subjects
    await User.findByIdAndUpdate(user._id, { weakSubjects, strongSubjects });

    // Weekly chart data
    const weeklyData = monthProgress.slice(-7).map(p => ({
      date: p.date,
      questions: p.questionsAttempted,
      correct: p.questionsCorrect,
      studyMinutes: p.studyMinutes,
      accuracy: p.questionsAttempted > 0 ? Math.round((p.questionsCorrect / p.questionsAttempted) * 100) : 0
    }));

    // Badges check
    const badges = [];
    if (user.streak >= 7) badges.push({ name: 'Week Warrior', icon: '🔥', description: '7-day streak!' });
    if (user.streak >= 30) badges.push({ name: 'Month Master', icon: '⭐', description: '30-day streak!' });
    if (totalAttempted >= 100) badges.push({ name: 'Century Club', icon: '💯', description: '100 questions solved!' });
    if (accuracy >= 80) badges.push({ name: 'Accuracy Ace', icon: '🎯', description: '80%+ accuracy!' });

    res.json({
      user: { name: user.name, streak: user.streak, currentClass: user.currentClass, avatar: user.avatar },
      today: todayProgress || { questionsAttempted: 0, questionsCorrect: 0, studyMinutes: 0 },
      overall: { totalAttempted, totalCorrect, accuracy, streak: user.streak },
      subjects: subjectArray,
      weakSubjects,
      strongSubjects,
      weeklyData,
      badges,
      interviewReadiness: Math.min(100, Math.round((user.streak * 2 + accuracy * 0.5 + (monthProgress.filter(p => p.mockInterviewDone).length * 10)))),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update study time
router.post('/study-time', protect, async (req, res) => {
  try {
    const { minutes } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, date: today },
      { $inc: { studyMinutes: minutes } },
      { upsert: true, new: true }
    );
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
