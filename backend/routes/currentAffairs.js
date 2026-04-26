const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect, adminOnly } = require('../middleware/auth');
const CurrentAffairs = require('../models/CurrentAffairs');

async function callGroq(prompt) {
  const res = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    { model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], temperature: 0.4, max_tokens: 2000 },
    { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }, timeout: 30000 }
  );
  return res.data.choices[0].message.content;
}

async function callGemini(prompt) {
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4, maxOutputTokens: 2000 } },
    { timeout: 30000 }
  );
  return res.data.candidates[0].content.parts[0].text;
}

async function generateTodayNews(today) {
  const dateObj = new Date(today);
  const dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `You are a UPSC current affairs expert. Generate 8 important current affairs news articles for India dated ${dateStr}.

Cover these categories: polity, economy, international, environment, science, social, general

Return a JSON array of exactly 8 articles:
[
  {
    "title": "Specific news headline about India",
    "summary": "3-4 line detailed summary of what happened, who is involved, and key facts",
    "upscRelevance": "Why this is important for UPSC CSE - which GS paper, which topic",
    "category": "polity/economy/science/environment/international/social/general",
    "source": "PIB/The Hindu/Indian Express/Mint/Livemint",
    "tags": ["tag1", "tag2", "tag3"]
  }
]

Make the news realistic, factual-style, and highly relevant for UPSC preparation. Cover topics like:
- Government schemes and policies
- Economic indicators and RBI decisions  
- India's foreign relations
- Environment and climate
- Science and technology in India
- Social issues and welfare schemes
- Constitutional and legal developments
- Defence and security

Return ONLY the JSON array, no other text.`;

  let text;
  try { text = await callGroq(prompt); }
  catch { text = await callGemini(prompt); }

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Could not parse AI response');
  return JSON.parse(jsonMatch[0]);
}

// Get today's current affairs
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Return cached if already generated today
    const existing = await CurrentAffairs.find({ date: today, isActive: true }).sort('-createdAt');
    if (existing.length > 0) return res.json(existing);

    // Generate fresh news with AI
    const articles = await generateTodayNews(today);
    const saved = await CurrentAffairs.insertMany(
      articles.map(a => ({ ...a, date: today, isActive: true }))
    );
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current affairs by date range
router.get('/', protect, async (req, res) => {
  try {
    const { from, to, category, limit = 20, page = 1 } = req.query;
    const query = { isActive: true };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = from;
      if (to) query.date.$lte = to;
    }
    if (category) query.category = category;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [articlesList, total] = await Promise.all([
      CurrentAffairs.find(query).sort('-date').skip(skip).limit(parseInt(limit)),
      CurrentAffairs.countDocuments(query)
    ]);
    res.json({ articles: articlesList, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get quiz for a current affairs article
router.get('/:id/quiz', protect, async (req, res) => {
  try {
    const article = await CurrentAffairs.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Not found' });
    if (article.quiz?.length > 0) return res.json(article.quiz);

    const prompt = `Based on this current affairs article:
Title: ${article.title}
Summary: ${article.summary}
UPSC Relevance: ${article.upscRelevance}

Generate 3 UPSC-style MCQ questions. Return ONLY a JSON array:
[{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correctAnswer":"A) ...","explanation":"..."}]`;

    let text;
    try { text = await callGroq(prompt); }
    catch { text = await callGemini(prompt); }

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      article.quiz = JSON.parse(jsonMatch[0]);
      await article.save();
    }
    res.json(article.quiz || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Force regenerate today's news (admin)
router.post('/regenerate', protect, adminOnly, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await CurrentAffairs.deleteMany({ date: today });
    const articles = await generateTodayNews(today);
    const saved = await CurrentAffairs.insertMany(
      articles.map(a => ({ ...a, date: today, isActive: true }))
    );
    res.json({ message: `Generated ${saved.length} articles`, articles: saved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Add manually
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const article = await CurrentAffairs.create(req.body);
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
