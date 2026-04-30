const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const { callAI } = require('../lib/aiUtils');

const GUEST_ID = '000000000000000000000001';

const INTERVIEW_SYSTEM = `You are a senior UPSC Interview Board member. Conduct a personality test for an IAS aspirant.
Be formal, authoritative, and professional. Evaluate answers on depth, clarity, ethics, and leadership.`;

const QUESTION_BANK = [
  { type: 'personal', question: 'Good morning. Tell me about yourself and why you aspire to join the civil service.' },
  { type: 'personal', question: 'Tell us about a situation where you demonstrated leadership or took initiative.' },
  { type: 'personal', question: 'What are your key strengths and areas where you need improvement?' },
  { type: 'knowledge', question: 'What do you consider the most pressing challenge facing India today, and how would you address it?' },
  { type: 'knowledge', question: 'How do you stay informed about current affairs and national issues?' },
  { type: 'knowledge', question: 'What is your perspective on climate change and India\'s environmental responsibilities?' },
  { type: 'scenario', question: 'Scenario: You are appointed as the District Collector of a drought-affected district. Farmers demand relief but budget is limited. How would you handle this?' },
  { type: 'scenario', question: 'Scenario: Your senior asks you to approve a project violating environmental regulations for revenue. What do you do?' },
  { type: 'scenario', question: 'Scenario: You discover a popular politician is involved in corruption but action could cause unrest. What would you do?' },
  { type: 'scenario', question: 'Scenario: During a communal riot, you receive conflicting orders from superiors. How do you navigate this?' },
  { type: 'governance', question: 'If appointed as District Collector tomorrow, what would be your first three actions?' },
  { type: 'governance', question: 'India aims to become a developed nation by 2047. What role do you see for yourself?' },
  { type: 'governance', question: 'How would you approach gender inequality in rural India as an administrator?' },
  { type: 'ethics', question: 'Define "public service" in your own words. What does it mean to you?' },
  { type: 'ethics', question: 'Name a leader who inspires you and explain what qualities you admire.' },
  { type: 'closing', question: 'Finally, is there anything else you\'d like to tell us or ask the board?' }
];

router.post('/start', async (req, res) => {
  try {
    const firstQuestion = QUESTION_BANK[0].question;
    res.json({
      message: `Good morning. Welcome to your UPSC Personality Test simulation.\n\nWe have ${QUESTION_BANK.length} questions. Answer with clarity and conviction.\n\n**Question 1:** ${firstQuestion}`,
      questionIndex: 0, totalQuestions: QUESTION_BANK.length, question: firstQuestion
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/answer', async (req, res) => {
  try {
    const { answer, questionIndex } = req.body;
    const currentQ = QUESTION_BANK[questionIndex];
    const nextQ = QUESTION_BANK[questionIndex + 1];
    const isLast = !nextQ;

    const prompt = `${INTERVIEW_SYSTEM}\n\nQuestion: "${currentQ.question}"\nAnswer: "${answer}"\n\nGive 2-line feedback, scores (Content/Communication/Confidence out of 10), and ${nextQ ? `ask: "${nextQ.question}"` : 'give final assessment'}.`;
    const result = await callAI(prompt, 600);

    if (isLast) {
      const today = new Date().toISOString().split('T')[0];
      await Progress.findOneAndUpdate({ userId: GUEST_ID, date: today }, { mockInterviewDone: true }, { upsert: true });
    }

    res.json({ feedback: result.text, nextQuestionIndex: isLast ? null : questionIndex + 1, isComplete: isLast, nextQuestion: nextQ?.question || null, provider: result.provider });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/analysis', async (req, res) => {
  try {
    const { answers, scores } = req.body;
    const avgContent = (scores.reduce((s, x) => s + x.content, 0) / scores.length).toFixed(1);
    const avgComm = (scores.reduce((s, x) => s + x.communication, 0) / scores.length).toFixed(1);
    const avgConf = (scores.reduce((s, x) => s + x.confidence, 0) / scores.length).toFixed(1);

    const prompt = `${INTERVIEW_SYSTEM}\n\nAnalyze this UPSC interview performance:\nAnswers: ${answers.map((a, i) => `Q${i+1}: ${a}`).join('\n')}\nAvg Scores - Content: ${avgContent}/10, Communication: ${avgComm}/10, Confidence: ${avgConf}/10\n\nProvide: Overall Summary, Strengths (3), Areas for Improvement (3), Recommendations (3), Final Verdict.`;
    const result = await callAI(prompt, 1500);
    res.json({ analysis: result.text, provider: result.provider });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/tips', (_req, res) => {
  res.json([
    { category: 'Body Language', tip: 'Sit straight, maintain eye contact, smile naturally', icon: '🧍' },
    { category: 'Communication', tip: 'Speak clearly, not too fast. Pause before answering.', icon: '🗣️' },
    { category: 'Content', tip: 'Structure answers: Point 1, Point 2, Conclusion', icon: '📝' },
    { category: 'Confidence', tip: 'It\'s okay to say "I don\'t know" — honesty is valued', icon: '💪' },
    { category: 'Current Affairs', tip: 'Read newspaper daily. Know India\'s major policies.', icon: '📰' },
    { category: 'Ethics', tip: 'Always choose integrity over convenience', icon: '⚖️' },
  ]);
});

module.exports = router;
