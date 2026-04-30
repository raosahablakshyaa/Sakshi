const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ChatHistory = require('../models/ChatHistory');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const { callAI } = require('../lib/aiUtils');

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

// Build personalized system prompt
function buildPersonalizedPrompt(user) {
  const context = user.getPersonalizationContext();
  
  let personalizedPrompt = SYSTEM_PROMPT;
  
  // Add learning speed adaptation
  if (context.learningSpeed === 'slow') {
    personalizedPrompt += `\n\nLearning Speed: SLOW - Break concepts into smaller chunks, use more examples, go step-by-step, be patient and encouraging.`;
  } else if (context.learningSpeed === 'fast') {
    personalizedPrompt += `\n\nLearning Speed: FAST - Move quickly through concepts, provide advanced insights, challenge with complex questions, assume prior knowledge.`;
  } else {
    personalizedPrompt += `\n\nLearning Speed: MEDIUM - Balance between depth and pace, provide examples but also challenge thinking.`;
  }
  
  // Add subject performance context
  if (context.strongSubjects.length > 0) {
    personalizedPrompt += `\n\nStrong Subjects: ${context.strongSubjects.join(', ')} - Can use these as reference points for learning new concepts.`;
  }
  
  if (context.weakSubjects.length > 0) {
    personalizedPrompt += `\n\nWeak Subjects: ${context.weakSubjects.join(', ')} - Need extra care, more examples, and frequent revision.`;
  }
  
  // Add personality and motivation
  if (context.personalityTraits.length > 0) {
    personalizedPrompt += `\n\nPersonality: ${context.personalityTraits.join(', ')} - Adapt communication style accordingly.`;
  }
  
  if (context.motivationFactors.length > 0) {
    personalizedPrompt += `\n\nMotivation Factors: ${context.motivationFactors.join(', ')} - Use these to keep ${context.name} motivated.`;
  }
  
  // Add mentor notes
  if (context.mentorNotes) {
    personalizedPrompt += `\n\nMentor Notes: ${context.mentorNotes}`;
  }
  
  // Add accuracy context
  personalizedPrompt += `\n\nCurrent Accuracy: ${context.accuracy}% | Streak: ${context.streak} days | Class: ${context.class}`;
  
  return personalizedPrompt;
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

    // Build personalized prompt
    const personalizedPrompt = buildPersonalizedPrompt(req.user);

    const result = await callAI(
      `${personalizedPrompt}\n\nUser: ${message}`,
      1024
    );

    const reply = result.text;

    history.messages.push({ role: 'assistant', content: reply });
    await history.save();

    // Update user's learning speed based on interaction patterns
    await updateLearningProfile(req.user._id, message, reply);

    res.json({ reply, sessionId: sid, provider: result.provider });
  } catch (err) {
    res.status(500).json({ message: 'AI mentor is taking a short break. Please try again!', error: err.message });
  }
});

// Update learning profile based on interactions
async function updateLearningProfile(userId, userMessage, mentorReply) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Analyze message length to detect learning speed
    const messageLength = userMessage.length;
    if (messageLength < 50 && user.learningSpeed !== 'slow') {
      user.learningSpeed = 'slow';
    } else if (messageLength > 200 && user.learningSpeed !== 'fast') {
      user.learningSpeed = 'fast';
    }

    // Extract topics from conversation
    const topics = extractTopics(userMessage);
    topics.forEach(topic => {
      if (!user.preferredTopics.includes(topic)) {
        user.preferredTopics.push(topic);
      }
    });

    await user.save();
  } catch (err) {
    console.log('Error updating learning profile:', err.message);
  }
}

// Extract topics from user message
function extractTopics(message) {
  const topics = [];
  const keywords = ['history', 'geography', 'polity', 'economics', 'science', 'environment', 'current affairs', 'constitution', 'upsc', 'mains', 'prelims'];
  
  keywords.forEach(keyword => {
    if (message.toLowerCase().includes(keyword)) {
      topics.push(keyword);
    }
  });
  
  return topics;
}

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

// Quick explain
router.post('/explain', protect, async (req, res) => {
  try {
    const { topic, subject, level = 'beginner' } = req.body;
    const personalizedPrompt = buildPersonalizedPrompt(req.user);
    const prompt = `${personalizedPrompt}\n\nExplain "${topic}" from ${subject || 'general studies'} at ${level} level. Connect it to UPSC relevance if applicable. Keep it clear and engaging for a Class ${req.user.currentClass} student aspiring to be an IAS officer.`;
    const result = await callAI(prompt, 1024);
    res.json({ explanation: result.text, provider: result.provider });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Daily motivation
router.get('/motivation', protect, async (req, res) => {
  try {
    const personalizedPrompt = buildPersonalizedPrompt(req.user);
    const prompt = `${personalizedPrompt}\n\nGive ${req.user.name} a powerful, personalized motivational message for today. Include: 1 inspiring quote, 1 IAS topper story snippet, and 1 actionable tip for today. Keep it warm, personal, and in Hinglish. Max 150 words.`;
    const result = await callAI(prompt, 500);
    res.json({ motivation: result.text, provider: result.provider });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user learning profile (admin/user endpoint)
router.put('/profile/learning', protect, async (req, res) => {
  try {
    const { learningSpeed, learningStyle, preferredTopics, weakSubjects, personalityTraits, motivationFactors, mentorNotes } = req.body;
    
    const user = await User.findByIdAndUpdate(req.user._id, {
      learningSpeed: learningSpeed || req.user.learningSpeed,
      learningStyle: learningStyle || req.user.learningStyle,
      preferredTopics: preferredTopics || req.user.preferredTopics,
      weakSubjects: weakSubjects || req.user.weakSubjects,
      personalityTraits: personalityTraits || req.user.personalityTraits,
      motivationFactors: motivationFactors || req.user.motivationFactors,
      mentorNotes: mentorNotes || req.user.mentorNotes
    }, { new: true });
    
    res.json({ message: 'Learning profile updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
