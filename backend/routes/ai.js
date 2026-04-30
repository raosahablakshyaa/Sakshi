const express = require('express');
const router = express.Router();
const ChatHistory = require('../models/ChatHistory');
const { v4: uuidv4 } = require('uuid');
const { callAI } = require('../lib/aiUtils');

const SYSTEM_PROMPT = `You are "Sakshi's Mentor" — an elite AI mentor for Sakshi, a Class 7 student from India who wants to become an IAS officer.
Speak in Hinglish (Hindi + English mix). Be direct, structured, and motivating.
Connect every topic to UPSC relevance. End responses with a follow-up question or action item.`;

router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId, subject } = req.body;
    const sid = sessionId || uuidv4();

    let history = await ChatHistory.findOne({ sessionId: sid });
    if (!history) history = new ChatHistory({ sessionId: sid, subject, messages: [] });

    history.messages.push({ role: 'user', content: message });
    const result = await callAI(`${SYSTEM_PROMPT}\n\nUser: ${message}`, 1024);
    history.messages.push({ role: 'assistant', content: result.text });
    await history.save();

    res.json({ reply: result.text, sessionId: sid, provider: result.provider });
  } catch (err) {
    res.status(500).json({ message: 'AI mentor is taking a short break. Please try again!', error: err.message });
  }
});

router.get('/sessions', async (req, res) => {
  try {
    const sessions = await ChatHistory.find()
      .select('sessionId subject createdAt messages').sort('-createdAt').limit(20);
    res.json(sessions.map(s => ({
      sessionId: s.sessionId, subject: s.subject, createdAt: s.createdAt,
      preview: s.messages[0]?.content?.slice(0, 80) || '',
      messageCount: s.messages.length
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/sessions/:sessionId', async (req, res) => {
  try {
    const session = await ChatHistory.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/explain', async (req, res) => {
  try {
    const { topic, subject, level = 'beginner' } = req.body;
    const result = await callAI(`${SYSTEM_PROMPT}\n\nExplain "${topic}" from ${subject || 'general studies'} at ${level} level with UPSC relevance.`, 1024);
    res.json({ explanation: result.text, provider: result.provider });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/motivation', async (req, res) => {
  try {
    const result = await callAI(`${SYSTEM_PROMPT}\n\nGive Sakshi a powerful motivational message for today. Include 1 quote, 1 IAS topper story, 1 tip. Hinglish. Max 150 words.`, 500);
    res.json({ motivation: result.text, provider: result.provider });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
