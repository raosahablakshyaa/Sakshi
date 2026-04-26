const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');
const Progress = require('../models/Progress');

const INTERVIEW_SYSTEM = `You are a senior UPSC Interview Board member conducting a personality test for an IAS aspirant. 
You ask thoughtful, probing questions about current affairs, general awareness, the candidate's background, opinions on social issues, leadership, ethics, and personality.
Be formal but encouraging. After each answer, give brief constructive feedback and ask the next question.
For a student who is currently in school, adjust questions to be age-appropriate but intellectually stimulating.`;

const QUESTION_BANK = [
  "Introduce yourself and tell us why you want to become an IAS officer.",
  "What do you think is the biggest challenge facing India today?",
  "If you were the District Collector of your district, what would be your first priority?",
  "What is your opinion on the role of technology in governance?",
  "Tell us about a leader who inspires you and why.",
  "How would you handle a situation where your senior officer asks you to do something unethical?",
  "What do you understand by 'public service'?",
  "How do you think India can achieve its goal of becoming a developed nation by 2047?",
  "What is your view on the importance of education in national development?",
  "Tell us about a time when you showed leadership.",
  "What are your strengths and weaknesses?",
  "How do you stay updated with current affairs?",
  "What is your opinion on climate change and India's responsibility?",
  "How would you promote gender equality in rural areas as an IAS officer?",
  "What motivates you to study hard every day?"
];

// Start interview session
router.post('/start', protect, async (req, res) => {
  try {
    const { mode = 'text' } = req.body;
    const firstQuestion = QUESTION_BANK[0];
    const intro = `Welcome to your IAS Personality Test simulation! 🎓

I am your interview board member today. This session will help you practice for the UPSC personality test.

Remember:
✅ Speak confidently and clearly
✅ Structure your answers (Point 1, Point 2...)
✅ Be honest and authentic
✅ Connect your answers to real examples

Let's begin!

**Question 1:** ${firstQuestion}

Take your time, think clearly, and give your best answer.`;

    res.json({ message: intro, questionIndex: 0, totalQuestions: QUESTION_BANK.length, mode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit answer and get next question + feedback
router.post('/answer', protect, async (req, res) => {
  try {
    const { answer, questionIndex, conversationHistory = [] } = req.body;
    const currentQuestion = QUESTION_BANK[questionIndex];
    const nextQuestion = QUESTION_BANK[questionIndex + 1];

    const prompt = `You are a UPSC interview board member.

Question asked: "${currentQuestion}"
Candidate's answer: "${answer}"

Please:
1. Give brief feedback on this answer (2-3 lines): what was good, what could be improved
2. Give a score out of 10 for: Content (depth), Communication (clarity), Confidence (tone)
3. ${nextQuestion ? `Ask the next question: "${nextQuestion}"` : 'This was the last question. Give a final overall assessment and encouragement.'}

Format your response as:
**Feedback:** [your feedback]
**Scores:** Content: X/10 | Communication: X/10 | Confidence: X/10
${nextQuestion ? `**Next Question:** ${nextQuestion}` : '**Final Assessment:** [overall assessment]'}`;

    let reply;
    try {
      const geminiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.6, maxOutputTokens: 600 } },
        { timeout: 25000 }
      );
      reply = geminiRes.data.candidates[0].content.parts[0].text;
    } catch {
      const groqRes = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        { model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: INTERVIEW_SYSTEM }, { role: 'user', content: prompt }], temperature: 0.6, max_tokens: 600 },
        { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }, timeout: 25000 }
      );
      reply = groqRes.data.choices[0].message.content;
    }

    const isLast = !nextQuestion;
    if (isLast) {
      const today = new Date().toISOString().split('T')[0];
      await Progress.findOneAndUpdate(
        { userId: req.user._id, date: today },
        { mockInterviewDone: true },
        { upsert: true }
      );
    }

    res.json({ feedback: reply, nextQuestionIndex: isLast ? null : questionIndex + 1, isComplete: isLast });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get interview tips
router.get('/tips', protect, async (req, res) => {
  const tips = [
    { category: 'Body Language', tip: 'Sit straight, maintain eye contact, and smile naturally', icon: '🧍' },
    { category: 'Communication', tip: 'Speak clearly, not too fast. Pause before answering.', icon: '🗣️' },
    { category: 'Content', tip: 'Structure answers: Point 1, Point 2, Conclusion', icon: '📝' },
    { category: 'Confidence', tip: 'It\'s okay to say "I don\'t know" — honesty is valued', icon: '💪' },
    { category: 'Current Affairs', tip: 'Read newspaper daily. Know India\'s major policies.', icon: '📰' },
    { category: 'Ethics', tip: 'Always choose integrity over convenience in your answers', icon: '⚖️' },
    { category: 'Personality', tip: 'Show empathy, leadership, and problem-solving mindset', icon: '🌟' },
    { category: 'Preparation', tip: 'Know your DAF (Detailed Application Form) thoroughly', icon: '📋' },
  ];
  res.json(tips);
});

module.exports = router;
