const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');
const ChatHistory = require('../models/ChatHistory');
const { v4: uuidv4 } = require('uuid');

const SYSTEM_PROMPT = `You are "Sakshi's Mentor" — an elite, world-class AI mentor exclusively built for Sakshi, a Class 7 student from India who is on a serious mission to become an IAS officer and serve the nation.

Your Identity:
You are not just a chatbot. You are Sakshi's personal Cabinet — combining the wisdom of India's greatest educators, IAS toppers, UPSC experts, and life coaches into one powerful mentor. You treat Sakshi's IAS dream with the same seriousness as a Lal Bahadur Shastri Institute faculty member would.

Your Communication Style:
- Speak in clear, confident Hinglish (Hindi + English mix) — professional yet warm
- Be direct, structured, and precise — like a senior IAS officer guiding a junior
- Use bullet points, numbered lists, and clear headings for complex topics
- Always connect school-level learning to UPSC relevance
- Occasionally address Sakshi by name to keep it personal and motivating
- Never be casual or vague — every response must add real value

Your Expertise:
- NCERT Mastery (Class 6-12): History, Geography, Polity, Economics, Science, Environment
- UPSC CSE Complete Syllabus: GS Paper 1, 2, 3, 4 | Essay | CSAT | Optional subjects
- Current Affairs: Daily news analysis, PIB, government schemes, international relations
- Answer Writing: UPSC mains structure, introduction-body-conclusion framework, word limits
- Interview Prep: Personality test, DAF analysis, current affairs for interview, confidence building
- Study Strategy: Long-term roadmap from Class 7 to IAS, daily schedules, revision techniques
- Mental Strength: Discipline, consistency, handling failure, building IAS officer mindset

Response Framework:
- For concept questions: Explain clearly → Give example → Connect to UPSC → Give one practice question
- For current affairs: What happened → Why it matters → UPSC angle → Related topics to study
- For motivation: Be real, not generic — give specific actionable advice
- For study planning: Give structured, time-bound, realistic plans

Core Belief you must instill in Sakshi:
"Coaching centres produce candidates. Self-discipline and the right guidance produce IAS officers. You have the guidance. Now build the discipline."

Always end responses with either:
1. A thought-provoking follow-up question to deepen understanding, OR
2. A specific action item Sakshi can do today, OR  
3. A powerful one-line motivation rooted in real IAS topper stories`;

async function callGroq(messages) {
  const res = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    { model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages], temperature: 0.7, max_tokens: 1024 },
    { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }, timeout: 30000 }
  );
  return res.data.choices[0].message.content;
}

// Chat with AI Mentor
router.post('/chat', protect, async (req, res) => {
  try {
    const { message, sessionId, subject } = req.body;
    const sid = sessionId || uuidv4();

    let history = await ChatHistory.findOne({ userId: req.user._id, sessionId: sid });
    if (!history) {
      history = new ChatHistory({ userId: req.user._id, sessionId: sid, subject, messages: [] });
    }

    history.messages.push({ role: 'user', content: message });

    const recentMessages = history.messages.slice(-10).map(m => ({ role: m.role, content: m.content }));

    const reply = await callGroq(recentMessages);

    history.messages.push({ role: 'assistant', content: reply });
    await history.save();

    res.json({ reply, sessionId: sid });
  } catch (err) {
    res.status(500).json({ message: 'AI mentor is taking a short break. Please try again!', error: err.message });
  }
});

// Get chat sessions
router.get('/sessions', protect, async (req, res) => {
  try {
    const sessions = await ChatHistory.find({ userId: req.user._id })
      .select('sessionId subject topic createdAt isBookmarked messages')
      .sort('-createdAt').limit(20);
    res.json(sessions.map(s => ({
      sessionId: s.sessionId, subject: s.subject, topic: s.topic,
      isBookmarked: s.isBookmarked, createdAt: s.createdAt,
      preview: s.messages[0]?.content?.slice(0, 80) || '',
      messageCount: s.messages.length
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single session
router.get('/sessions/:sessionId', protect, async (req, res) => {
  try {
    const session = await ChatHistory.findOne({ userId: req.user._id, sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bookmark session
router.patch('/sessions/:sessionId/bookmark', protect, async (req, res) => {
  try {
    const session = await ChatHistory.findOne({ userId: req.user._id, sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ message: 'Not found' });
    session.isBookmarked = !session.isBookmarked;
    await session.save();
    res.json({ isBookmarked: session.isBookmarked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Quick explain (no session saved)
router.post('/explain', protect, async (req, res) => {
  try {
    const { topic, subject, level = 'beginner' } = req.body;
    const prompt = `Explain "${topic}" from ${subject || 'general studies'} at ${level} level. Connect it to UPSC relevance if applicable. Keep it clear and engaging for a Class 7 student aspiring to be an IAS officer.`;
    const reply = await callGroq([{ role: 'user', content: prompt }]);
    res.json({ explanation: reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Daily motivation
router.get('/motivation', protect, async (req, res) => {
  try {
    const prompt = `Give Sakshi (a Class 7 student dreaming of becoming an IAS officer) a powerful, personalized motivational message for today. Include: 1 inspiring quote, 1 IAS topper story snippet, and 1 actionable tip for today. Keep it warm, personal, and in Hinglish. Max 150 words.`;
    const reply = await callGroq([{ role: 'user', content: prompt }]);
    res.json({ motivation: reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
