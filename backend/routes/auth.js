const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, username, password, currentClass, role, parentEmail } = req.body;
    
    if (!username || username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }
    
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: 'Email already registered' });
    
    const usernameExists = await User.findOne({ username: username.toLowerCase() });
    if (usernameExists) return res.status(400).json({ message: 'Username already taken' });
    
    const user = await User.create({ 
      name, 
      email, 
      username: username.toLowerCase(), 
      password, 
      currentClass, 
      role, 
      parentEmail 
    });
    
    res.status(201).json({ 
      token: signToken(user._id), 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        username: user.username,
        role: user.role, 
        currentClass: user.currentClass 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login with email or username
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    
    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Email/Username and password required' });
    }
    
    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername.toLowerCase() }
      ]
    });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email/username or password' });
    }
    
    user.updateStreak();
    await user.save();
    
    res.json({ 
      token: signToken(user._id), 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        username: user.username,
        role: user.role, 
        currentClass: user.currentClass, 
        streak: user.streak, 
        avatar: user.avatar 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check username availability
router.post('/check-username', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username || username.length < 3) {
      return res.json({ available: false, message: 'Username must be at least 3 characters' });
    }
    
    const exists = await User.findOne({ username: username.toLowerCase() });
    res.json({ available: !exists, message: exists ? 'Username taken' : 'Username available' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Google OAuth (Firebase token verification)
router.post('/google', async (req, res) => {
  try {
    const { name, email, googleId, avatar } = req.body;
    let user = await User.findOne({ email });
    
    if (!user) {
      // Generate unique username from email
      let username = email.split('@')[0];
      let counter = 1;
      while (await User.findOne({ username: username.toLowerCase() })) {
        username = `${email.split('@')[0]}${counter}`;
        counter++;
      }
      
      user = await User.create({ 
        name, 
        email, 
        username: username.toLowerCase(),
        googleId, 
        avatar, 
        password: null 
      });
    } else { 
      user.googleId = googleId; 
      user.avatar = avatar; 
      await user.save(); 
    }
    
    user.updateStreak();
    await user.save();
    
    res.json({ 
      token: signToken(user._id), 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        username: user.username,
        role: user.role, 
        currentClass: user.currentClass, 
        streak: user.streak, 
        avatar: user.avatar 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get profile
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// Get mastered questions count
router.get('/mastered-count', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ masteredCount: user.masteredQuestions.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
