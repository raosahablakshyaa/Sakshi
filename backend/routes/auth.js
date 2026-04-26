const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, currentClass, role, parentEmail } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, currentClass, role, parentEmail });
    res.status(201).json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, currentClass: user.currentClass } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    user.updateStreak();
    await user.save();
    res.json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, currentClass: user.currentClass, streak: user.streak, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Google OAuth (Firebase token verification)
router.post('/google', async (req, res) => {
  try {
    const { name, email, googleId, avatar } = req.body;
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ name, email, googleId, avatar, password: null });
    else { user.googleId = googleId; user.avatar = avatar; await user.save(); }
    user.updateStreak();
    await user.save();
    res.json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, currentClass: user.currentClass, streak: user.streak, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get profile
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// Update profile
router.put('/me', protect, async (req, res) => {
  try {
    const updates = ['name', 'currentClass', 'targetYear', 'studyGoalMinutes', 'theme', 'notifications'];
    updates.forEach(field => { if (req.body[field] !== undefined) req.user[field] = req.body[field]; });
    await req.user.save();
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
