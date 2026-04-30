const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Progress = require('../models/Progress');

const GUEST_ID = '000000000000000000000001';

function getTodayIST() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).toISOString().split('T')[0];
}

router.get('/daily', async (req, res) => {
  try {
    const { subject, difficulty = 'beginner', limit = 50 } = req.query;
    if (!subject) return res.status(400).json({ message: 'Subject required' });
    const query = { isActive: true, subject };
    if (difficulty) query.difficulty = difficulty;
    const questions = await Question.aggregate([{ $match: query }, { $sample: { size: Math.min(parseInt(limit), 100) } }]);
    res.json(questions);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/ai-generated', async (req, res) => {
  try {
    const { subject, difficulty = 'beginner', count = 25 } = req.query;
    if (!subject) return res.status(400).json({ message: 'Subject required' });
    res.json(generateFallbackQuestions(subject, parseInt(count), difficulty));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

function generateFallbackQuestions(subject, count, difficulty) {
  const templates = {
    History: [
      { q: 'Who founded the Mauryan Empire?', opts: ['Ashoka', 'Chandragupta Maurya', 'Bindusara', 'Brihadratha'], ans: 'B', exp: 'Chandragupta Maurya founded the Mauryan Empire around 322 BCE.' },
      { q: 'Which emperor spread Buddhism across Asia?', opts: ['Chandragupta', 'Ashoka', 'Harsha', 'Akbar'], ans: 'B', exp: 'Emperor Ashoka spread Buddhism after the Kalinga War.' },
      { q: 'Capital of the Mauryan Empire?', opts: ['Pataliputra', 'Ujjain', 'Taxila', 'Varanasi'], ans: 'A', exp: 'Pataliputra (modern Patna) was the Mauryan capital.' },
    ],
    Geography: [
      { q: 'Capital of India?', opts: ['Mumbai', 'New Delhi', 'Bangalore', 'Kolkata'], ans: 'B', exp: 'New Delhi is the capital of India.' },
      { q: 'Longest river in India?', opts: ['Brahmaputra', 'Ganges', 'Yamuna', 'Godavari'], ans: 'B', exp: 'The Ganges is the longest river in India.' },
      { q: 'Which desert is in India?', opts: ['Sahara', 'Thar', 'Kalahari', 'Gobi'], ans: 'B', exp: 'The Thar Desert is in Rajasthan, India.' },
    ],
    'Political Science': [
      { q: 'Who drafted the Indian Constitution?', opts: ['Nehru', 'Dr. B.R. Ambedkar', 'Gandhi', 'Patel'], ans: 'B', exp: 'Dr. B.R. Ambedkar was the chief architect of the Constitution.' },
      { q: 'Head of state in India?', opts: ['Prime Minister', 'Chief Justice', 'President', 'Speaker'], ans: 'C', exp: 'The President is the head of state in India.' },
      { q: 'Term of the President of India?', opts: ['4 years', '5 years', '6 years', '7 years'], ans: 'B', exp: 'The President serves a 5-year term.' },
    ],
    Economics: [
      { q: 'Currency of India?', opts: ['Dollar', 'Pound', 'Rupee', 'Euro'], ans: 'C', exp: 'The Indian Rupee (₹) is the currency of India.' },
      { q: 'What is inflation?', opts: ['Increase in prices', 'Decrease in prices', 'Stable prices', 'No change'], ans: 'A', exp: 'Inflation is the increase in prices over time.' },
      { q: 'Central bank of India?', opts: ['SBI', 'RBI', 'PNB', 'HDFC'], ans: 'B', exp: 'RBI is the central bank of India.' },
    ],
    Science: [
      { q: 'Chemical formula of water?', opts: ['H2O', 'CO2', 'O2', 'N2'], ans: 'A', exp: 'Water is H2O.' },
      { q: 'What is photosynthesis?', opts: ['Process of eating', 'Process of breathing', 'Making food using sunlight', 'Process of sleeping'], ans: 'C', exp: 'Plants make food using sunlight, water, and CO2.' },
      { q: 'What is gravity?', opts: ['Force of attraction', 'Force of repulsion', 'Force of friction', 'Force of tension'], ans: 'A', exp: 'Gravity attracts objects towards Earth.' },
    ],
  };
  const t = templates[subject] || templates['History'];
  const timestamp = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const tmpl = t[i % t.length];
    return {
      _id: `fallback-${subject}-${timestamp}-${i}`,
      question: tmpl.q,
      options: tmpl.opts.map((o, idx) => `${String.fromCharCode(65 + idx)}) ${o}`),
      correctAnswer: `${tmpl.ans}) ${tmpl.opts[tmpl.ans.charCodeAt(0) - 65]}`,
      explanation: tmpl.exp, subject, difficulty, type: 'fallback', upscRelevance: true
    };
  });
}

router.post('/submit', async (req, res) => {
  try {
    const { questionId, selectedAnswer, subject, correctAnswer, explanation, timeTaken } = req.body;
    const isMock = typeof questionId === 'string' && (questionId.startsWith('fallback-') || questionId.startsWith('ai-'));
    const question = isMock ? null : await Question.findById(questionId);
    const isCorrect = selectedAnswer === (question?.correctAnswer || correctAnswer);

    if (question) { question.attemptCount += 1; if (isCorrect) question.correctCount += 1; await question.save(); }

    const today = getTodayIST();
    let progress = await Progress.findOne({ userId: GUEST_ID, date: today });
    if (!progress) progress = new Progress({ userId: GUEST_ID, date: today });
    progress.questionsAttempted += 1;
    if (isCorrect) progress.questionsCorrect += 1;
    const sub = progress.subjectBreakdown.find(s => s.subject === subject);
    if (sub) { sub.attempted += 1; if (isCorrect) sub.correct += 1; }
    else progress.subjectBreakdown.push({ subject, attempted: 1, correct: isCorrect ? 1 : 0 });
    await progress.save();

    res.json({ isCorrect, correctAnswer: question?.correctAnswer || correctAnswer, explanation: question?.explanation || explanation });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
