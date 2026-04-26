const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Progress = require('../models/Progress');
const { callAI } = require('../lib/aiUtils');

const INTERVIEW_SYSTEM = `You are a senior UPSC Interview Board member with 20+ years of experience in civil service. You are conducting a personality test for an IAS aspirant.
You are formal, authoritative, and professional. You ask probing questions about current affairs, governance, ethics, and personality.
Your tone is like a seasoned IAS officer - direct, no-nonsense, but fair and encouraging.
You evaluate answers based on: depth of knowledge, clarity of thought, ethical values, and leadership potential.
For a school student, you adjust questions to be age-appropriate but intellectually challenging.
After each answer, give brief but impactful feedback and move to the next question.
Be like a real UPSC board member - not overly friendly, but respectful and professional.`;

const QUESTION_BANK = [
  // Personal & Motivation
  { type: 'personal', question: 'Good morning. Tell me about yourself and why you aspire to join the civil service.' },
  { type: 'personal', question: 'Tell us about a situation where you demonstrated leadership or took initiative.' },
  { type: 'personal', question: 'What are your key strengths and areas where you need improvement?' },
  
  // Current Affairs & Knowledge
  { type: 'knowledge', question: 'What do you consider the most pressing challenge facing India today, and how would you address it?' },
  { type: 'knowledge', question: 'How do you stay informed about current affairs and national issues?' },
  { type: 'knowledge', question: 'What is your perspective on climate change and India\'s environmental responsibilities?' },
  
  // Scenario-Based Questions
  { type: 'scenario', question: 'Scenario: You are appointed as the District Collector of a drought-affected district. The local farmers are demanding immediate relief, but the government budget is limited. How would you prioritize and address this crisis?' },
  { type: 'scenario', question: 'Scenario: Your senior officer asks you to approve a project that violates environmental regulations but will bring significant revenue to the district. How would you handle this ethical dilemma?' },
  { type: 'scenario', question: 'Scenario: You discover that a popular local politician is involved in corruption. However, taking action against them could create social unrest. What would you do?' },
  { type: 'scenario', question: 'Scenario: During a communal riot, you receive conflicting orders from your superiors. One order could escalate violence, while the other could be seen as biased. How would you navigate this?' },
  
  // Governance & Vision
  { type: 'governance', question: 'If you were appointed as the District Collector tomorrow, what would be your first three actions?' },
  { type: 'governance', question: 'India aims to become a developed nation by 2047. What role do you see for yourself in this vision?' },
  { type: 'governance', question: 'How would you approach the problem of gender inequality in rural India as an administrator?' },
  
  // Values & Ethics
  { type: 'ethics', question: 'Define "public service" in your own words. What does it mean to you?' },
  { type: 'ethics', question: 'Name a leader who inspires you and explain what qualities you admire in them.' },
  
  // Closing
  { type: 'closing', question: 'Finally, is there anything else you\'d like to tell us about yourself or any question you\'d like to ask the board?' }
];

router.post('/start', protect, async (req, res) => {
  try {
    const { mode = 'text' } = req.body;
    const firstQuestion = QUESTION_BANK[0].question;
    const intro = `Good morning. Welcome to your UPSC Personality Test simulation.

I am your interview board member today. This is a serious assessment of your personality, knowledge, and suitability for civil service.

Remember:
✓ Answer with clarity and conviction
✓ Structure your thoughts logically
✓ Be honest and authentic
✓ Support your views with examples
✓ Listen carefully before responding

We have 16 questions for you today, including some scenario-based questions that test your decision-making and ethical values. Let's begin.

**Question 1:** ${firstQuestion}`;

    res.json({ message: intro, questionIndex: 0, totalQuestions: QUESTION_BANK.length, mode, question: firstQuestion });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/answer', protect, async (req, res) => {
  try {
    const { answer, questionIndex, conversationHistory = [] } = req.body;
    const currentQ = QUESTION_BANK[questionIndex];
    const nextQ = QUESTION_BANK[questionIndex + 1];
    const isLast = !nextQ;

    let feedbackFormat = `**Feedback:** [your feedback]
**Scores:** Content: X/10 | Communication: X/10 | Confidence: X/10`;
    
    if (nextQ) {
      feedbackFormat += `\n**Next Question:** ${nextQ.question}`;
    } else {
      feedbackFormat += `\n**Final Assessment:** [overall assessment]`;
    }

    const prompt = `${INTERVIEW_SYSTEM}

Question Type: ${currentQ.type}
Question asked: "${currentQ.question}"
Candidate's answer: "${answer}"

Please:
1. Give brief feedback on this answer (2-3 lines): what was good, what could be improved
2. Give a score out of 10 for: Content (depth), Communication (clarity), Confidence (tone)
3. ${nextQ ? `Ask the next question: "${nextQ.question}"` : 'This was the last question. Give a final overall assessment and encouragement.'}

Format your response as:
${feedbackFormat}`;

    const result = await callAI(prompt, 600);
    const reply = result.text;

    if (isLast) {
      const today = new Date().toISOString().split('T')[0];
      await Progress.findOneAndUpdate(
        { userId: req.user._id, date: today },
        { mockInterviewDone: true },
        { upsert: true }
      );
    }

    res.json({ 
      feedback: reply, 
      nextQuestionIndex: isLast ? null : questionIndex + 1, 
      isComplete: isLast, 
      nextQuestion: nextQ?.question || null,
      provider: result.provider 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/analysis', protect, async (req, res) => {
  try {
    const { answers, scores } = req.body;

    const analysisPrompt = `You are a senior UPSC Interview Board member. Based on the following interview responses and scores, provide a comprehensive analysis of the candidate's performance.

Candidate's Answers:
${answers.map((a, i) => `Q${i + 1}: ${a}`).join('\n')}

Scores Breakdown:
${scores.map((s, i) => `Q${i + 1} - Content: ${s.content}/10, Communication: ${s.communication}/10, Confidence: ${s.confidence}/10`).join('\n')}

Please provide a detailed analysis in the following format:

## 📊 Overall Performance Summary
[1-2 lines overall assessment]

## 💪 Strengths
- [Strength 1]
- [Strength 2]
- [Strength 3]

## 🎯 Areas for Improvement
- [Area 1]
- [Area 2]
- [Area 3]

## 📈 Category-wise Analysis
**Knowledge & Content:** [Assessment of depth and accuracy]
**Communication Skills:** [Assessment of clarity and articulation]
**Confidence & Presence:** [Assessment of confidence and demeanor]
**Ethical Values:** [Assessment of ethical reasoning]
**Leadership Potential:** [Assessment of leadership qualities]

## 🔑 Key Observations
- [Observation 1]
- [Observation 2]
- [Observation 3]

## 📋 Recommendations for Improvement
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

## 🎓 Final Verdict
[Encouraging closing statement with actionable advice]

**Average Scores:**
- Content: ${(scores.reduce((sum, s) => sum + s.content, 0) / scores.length).toFixed(1)}/10
- Communication: ${(scores.reduce((sum, s) => sum + s.communication, 0) / scores.length).toFixed(1)}/10
- Confidence: ${(scores.reduce((sum, s) => sum + s.confidence, 0) / scores.length).toFixed(1)}/10
- **Overall: ${(scores.reduce((sum, s) => sum + (s.content + s.communication + s.confidence) / 3, 0) / scores.length).toFixed(1)}/10**`;

    const result = await callAI(analysisPrompt, 1500);
    
    res.json({ 
      analysis: result.text,
      provider: result.provider
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
