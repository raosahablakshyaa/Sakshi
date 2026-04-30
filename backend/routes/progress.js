const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const User = require('../models/User');

const GUEST_ID = '000000000000000000000001';

router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let progress = await Progress.findOne({ userId: GUEST_ID, date: today });
    if (!progress) progress = new Progress({ userId: GUEST_ID, date: today });
    res.json(progress);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/history', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const from = new Date();
    from.setDate(from.getDate() - parseInt(days));
    const fromStr = from.toISOString().split('T')[0];
    const progress = await Progress.find({ userId: GUEST_ID, date: { $gte: fromStr } }).sort('date');
    res.json(progress);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const last30 = new Date();
    last30.setDate(last30.getDate() - 30);
    const last30Str = last30.toISOString().split('T')[0];

    const [todayProgress, monthProgress] = await Promise.all([
      Progress.findOne({ userId: GUEST_ID, date: today }),
      Progress.find({ userId: GUEST_ID, date: { $gte: last30Str } }).sort('date')
    ]);

    const subjectStats = {};
    monthProgress.forEach(p => {
      p.subjectBreakdown.forEach(s => {
        if (!subjectStats[s.subject]) subjectStats[s.subject] = { attempted: 0, correct: 0 };
        subjectStats[s.subject].attempted += s.attempted;
        subjectStats[s.subject].correct += s.correct;
      });
    });

    const subjectArray = Object.entries(subjectStats).map(([subject, stats]) => ({
      subject, attempted: stats.attempted, correct: stats.correct,
      accuracy: stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0
    })).sort((a, b) => b.attempted - a.attempted);

    const weeklyData = monthProgress.slice(-7).map(p => ({
      date: p.date, questions: p.questionsAttempted, correct: p.questionsCorrect,
      studyMinutes: p.studyMinutes,
      accuracy: p.questionsAttempted > 0 ? Math.round((p.questionsCorrect / p.questionsAttempted) * 100) : 0
    }));

    const totalAttempted = monthProgress.reduce((s, p) => s + p.questionsAttempted, 0);
    const totalCorrect = monthProgress.reduce((s, p) => s + p.questionsCorrect, 0);
    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    const streak = monthProgress.filter(p => p.questionsAttempted > 0).length;

    res.json({
      user: { name: 'Sakshi', streak, currentClass: 7, avatar: '' },
      today: todayProgress || { questionsAttempted: 0, questionsCorrect: 0, studyMinutes: 0 },
      overall: { totalAttempted, totalCorrect, accuracy, streak },
      subjects: subjectArray,
      weakSubjects: subjectArray.filter(s => s.accuracy < 50).map(s => s.subject),
      strongSubjects: subjectArray.filter(s => s.accuracy >= 70).map(s => s.subject),
      weeklyData, badges: [],
      interviewReadiness: Math.min(100, streak * 2 + accuracy * 0.5),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/study-time', async (req, res) => {
  try {
    const { minutes } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const progress = await Progress.findOneAndUpdate(
      { userId: GUEST_ID, date: today },
      { $inc: { studyMinutes: minutes } },
      { upsert: true, new: true }
    );
    res.json(progress);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
