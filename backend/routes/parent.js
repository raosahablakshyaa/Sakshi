const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Progress = require('../models/Progress');

// Get child's progress (parent accesses via parentEmail link)
router.get('/child/:childId', async (req, res) => {
  try {
    const child = await User.findById(req.params.childId).select('-password');
    if (!child) return res.status(404).json({ message: 'Student not found' });

    const last30 = new Date();
    last30.setDate(last30.getDate() - 30);
    const last30Str = last30.toISOString().split('T')[0];

    const monthProgress = await Progress.find({ userId: child._id, date: { $gte: last30Str } }).sort('date');

    const totalStudyMinutes = monthProgress.reduce((sum, p) => sum + p.studyMinutes, 0);
    const totalQuestions = monthProgress.reduce((sum, p) => sum + p.questionsAttempted, 0);
    const totalCorrect = monthProgress.reduce((sum, p) => sum + p.questionsCorrect, 0);
    const activeDays = monthProgress.filter(p => p.questionsAttempted > 0 || p.studyMinutes > 0).length;
    const interviewSessions = monthProgress.filter(p => p.mockInterviewDone).length;

    const weeklyData = monthProgress.slice(-7).map(p => ({
      date: p.date,
      studyMinutes: p.studyMinutes,
      questions: p.questionsAttempted,
      accuracy: p.questionsAttempted > 0 ? Math.round((p.questionsCorrect / p.questionsAttempted) * 100) : 0
    }));

    const subjectStats = {};
    monthProgress.forEach(p => {
      p.subjectBreakdown.forEach(s => {
        if (!subjectStats[s.subject]) subjectStats[s.subject] = { attempted: 0, correct: 0 };
        subjectStats[s.subject].attempted += s.attempted;
        subjectStats[s.subject].correct += s.correct;
      });
    });

    res.json({
      child: { name: child.name, currentClass: child.currentClass, streak: child.streak, avatar: child.avatar, targetYear: child.targetYear },
      summary: {
        totalStudyMinutes,
        totalStudyHours: Math.round(totalStudyMinutes / 60 * 10) / 10,
        totalQuestions,
        accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
        activeDays,
        currentStreak: child.streak,
        interviewSessions,
      },
      weeklyData,
      subjects: Object.entries(subjectStats).map(([subject, stats]) => ({
        subject,
        attempted: stats.attempted,
        accuracy: stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0
      })),
      weakSubjects: child.weakSubjects,
      strongSubjects: child.strongSubjects,
      badges: child.badges,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Find child by email (for parent to link)
router.get('/find-child', async (req, res) => {
  try {
    const { email } = req.query;
    const child = await User.findOne({ email, role: 'student' }).select('name email currentClass avatar streak');
    if (!child) return res.status(404).json({ message: 'Student not found' });
    res.json(child);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
