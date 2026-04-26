const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// Get daily questions
router.get('/daily', protect, async (req, res) => {
  try {
    const { subject, difficulty = 'beginner', limit = 10 } = req.query;
    const query = { isActive: true };
    if (subject) query.subject = subject;
    if (difficulty) query.difficulty = difficulty;
    const questions = await Question.aggregate([{ $match: query }, { $sample: { size: parseInt(limit) } }]);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get questions by subject/topic
router.get('/', protect, async (req, res) => {
  try {
    const { subject, topic, difficulty, type, class: cls, upscRelevance, limit = 20, page = 1 } = req.query;
    const query = { isActive: true };
    if (subject) query.subject = subject;
    if (topic) query.topic = new RegExp(topic, 'i');
    if (difficulty) query.difficulty = difficulty;
    if (type) query.type = type;
    if (cls) query.class = parseInt(cls);
    if (upscRelevance) query.upscRelevance = upscRelevance === 'true';
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [questions, total] = await Promise.all([
      Question.find(query).skip(skip).limit(parseInt(limit)),
      Question.countDocuments(query)
    ]);
    res.json({ questions, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit answer & track progress
router.post('/submit', protect, async (req, res) => {
  try {
    const { questionId, selectedAnswer, timeTaken, subject } = req.body;
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const isCorrect = selectedAnswer === question.correctAnswer;
    question.attemptCount += 1;
    if (isCorrect) question.correctCount += 1;
    await question.save();

    // Update daily progress
    const today = new Date().toISOString().split('T')[0];
    let progress = await Progress.findOne({ userId: req.user._id, date: today });
    if (!progress) progress = new Progress({ userId: req.user._id, date: today });

    progress.questionsAttempted += 1;
    if (isCorrect) progress.questionsCorrect += 1;

    const subEntry = progress.subjectBreakdown.find(s => s.subject === subject);
    if (subEntry) { subEntry.attempted += 1; if (isCorrect) subEntry.correct += 1; }
    else progress.subjectBreakdown.push({ subject: subject || question.subject, attempted: 1, correct: isCorrect ? 1 : 0 });

    await progress.save();

    // Update user totals
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalQuestionsAttempted: 1, totalCorrect: isCorrect ? 1 : 0 }
    });

    res.json({ isCorrect, correctAnswer: question.correctAnswer, explanation: question.explanation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Add question
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Bulk add questions
router.post('/bulk', protect, adminOnly, async (req, res) => {
  try {
    const questions = await Question.insertMany(req.body.questions);
    res.status(201).json({ inserted: questions.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update question
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(q);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Delete question
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Question.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Question deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
