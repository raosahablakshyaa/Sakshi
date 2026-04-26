const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Progress = require('../models/Progress');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { protect, adminOnly } = require('../middleware/auth');

// Get today's date in IST
function getTodayIST() {
  const now = new Date();
  const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  return istTime.toISOString().split('T')[0];
}

// Get daily questions - 50 per subject (25 AI + 25 PYQ)
router.get('/daily', protect, async (req, res) => {
  try {
    const { subject, difficulty = 'beginner', limit = 50 } = req.query;
    const userClass = req.user.currentClass;
    
    if (!subject) {
      return res.status(400).json({ message: 'Subject required' });
    }

    const user = await User.findById(req.user._id).select('masteredQuestions');
    const masteredIds = user?.masteredQuestions || [];
    
    const query = { isActive: true, class: userClass, subject: subject };
    if (masteredIds.length > 0) query._id = { $nin: masteredIds };
    if (difficulty) query.difficulty = difficulty;
    
    // Get random questions from database
    const questions = await Question.aggregate([
      { $match: query }, 
      { $sample: { size: Math.min(parseInt(limit), 100) } }
    ]);
    
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get AI-generated questions - 25 per request
router.get('/ai-generated', protect, async (req, res) => {
  try {
    const { subject, difficulty = 'beginner', count = 25 } = req.query;
    const userClass = req.user.currentClass;
    
    if (!subject) {
      return res.status(400).json({ message: 'Subject required' });
    }

    // Generate fallback questions since AI is not working
    const fallbackQuestions = generateFallbackQuestions(subject, parseInt(count), difficulty);
    res.json(fallbackQuestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate fallback questions
function generateFallbackQuestions(subject, count, difficulty) {
  const questions = [];
  const timestamp = Date.now();
  
  const questionTemplates = {
    History: [
      { q: 'Who was the founder of the Mauryan Empire?', opts: ['Ashoka', 'Chandragupta Maurya', 'Bindusara', 'Brihadratha'], ans: 'B', exp: 'Chandragupta Maurya founded the Mauryan Empire around 322 BCE.' },
      { q: 'Which emperor is known for spreading Buddhism across Asia?', opts: ['Chandragupta', 'Ashoka', 'Harsha', 'Akbar'], ans: 'B', exp: 'Emperor Ashoka spread Buddhism throughout Asia after the Kalinga War.' },
      { q: 'What was the capital of the Mauryan Empire?', opts: ['Pataliputra', 'Ujjain', 'Taxila', 'Varanasi'], ans: 'A', exp: 'Pataliputra (modern Patna) was the capital of the Mauryan Empire.' },
      { q: 'Which ancient Indian kingdom was known for its maritime trade?', opts: ['Mauryan', 'Chola', 'Gupta', 'Nanda'], ans: 'B', exp: 'The Chola Empire was famous for its maritime trade and naval power.' },
      { q: 'What was the main religion during the Vedic period?', opts: ['Buddhism', 'Jainism', 'Vedic Hinduism', 'Christianity'], ans: 'C', exp: 'Vedic Hinduism was the main religion during the Vedic period in ancient India.' },
      { q: 'Who was Ashoka\'s grandfather?', opts: ['Chandragupta Maurya', 'Bindusara', 'Brihadratha', 'Nanda'], ans: 'A', exp: 'Chandragupta Maurya was the grandfather of Ashoka.' },
      { q: 'What was the Kalinga War?', opts: ['A trade war', 'A war fought by Ashoka', 'A religious conflict', 'A naval battle'], ans: 'B', exp: 'The Kalinga War was fought by Ashoka and led him to embrace Buddhism.' },
      { q: 'Which dynasty ruled after the Mauryan Empire?', opts: ['Gupta', 'Chola', 'Nanda', 'Shunga'], ans: 'D', exp: 'The Shunga dynasty ruled after the Mauryan Empire ended.' },
      { q: 'What was the main occupation in ancient Indian kingdoms?', opts: ['Trade', 'Agriculture', 'Military', 'Crafts'], ans: 'B', exp: 'Agriculture was the main occupation in ancient Indian kingdoms.' },
      { q: 'Which ancient Indian text describes the Mauryan Empire?', opts: ['Rigveda', 'Arthashastra', 'Ramayana', 'Mahabharata'], ans: 'B', exp: 'The Arthashastra by Kautilya describes the Mauryan Empire.' }
    ],
    Geography: [
      { q: 'What is the capital of India?', opts: ['Mumbai', 'New Delhi', 'Bangalore', 'Kolkata'], ans: 'B', exp: 'New Delhi is the capital of India.' },
      { q: 'Which is the longest river in India?', opts: ['Brahmaputra', 'Ganges', 'Yamuna', 'Godavari'], ans: 'B', exp: 'The Ganges is the longest river in India, flowing about 2,525 km.' },
      { q: 'What is the highest mountain peak in India?', opts: ['K2', 'Kangchenjunga', 'Kanchenjunga', 'Nanda Devi'], ans: 'B', exp: 'Kangchenjunga is the highest mountain peak in India at 8,586 meters.' },
      { q: 'Which desert is located in India?', opts: ['Sahara', 'Thar', 'Kalahari', 'Gobi'], ans: 'B', exp: 'The Thar Desert is located in Rajasthan, India.' },
      { q: 'How many states and union territories does India have?', opts: ['28 states, 8 UTs', '29 states, 7 UTs', '30 states, 6 UTs', '27 states, 9 UTs'], ans: 'A', exp: 'India has 28 states and 8 union territories.' },
      { q: 'What type of climate does most of India have?', opts: ['Tropical', 'Temperate', 'Monsoon', 'Desert'], ans: 'C', exp: 'Most of India has a monsoon climate with seasonal rainfall.' },
      { q: 'Which ocean surrounds India on three sides?', opts: ['Atlantic', 'Pacific', 'Indian', 'Arctic'], ans: 'C', exp: 'The Indian Ocean surrounds India on three sides.' },
      { q: 'What is the Western Ghats?', opts: ['A mountain range', 'A river', 'A plateau', 'A valley'], ans: 'A', exp: 'The Western Ghats is a mountain range running along the western coast of India.' },
      { q: 'Which is the largest state by area in India?', opts: ['Rajasthan', 'Maharashtra', 'Madhya Pradesh', 'Uttar Pradesh'], ans: 'A', exp: 'Rajasthan is the largest state by area in India.' },
      { q: 'What is the approximate population of India?', opts: ['1.0 billion', '1.2 billion', '1.4 billion', '1.6 billion'], ans: 'C', exp: 'India has a population of approximately 1.4 billion people.' }
    ],
    'Political Science': [
      { q: 'What is the Constitution of India?', opts: ['A law book', 'The supreme law of India', 'A history book', 'A government manual'], ans: 'B', exp: 'The Constitution of India is the supreme law that governs the country.' },
      { q: 'Who is the head of state in India?', opts: ['Prime Minister', 'Chief Justice', 'President', 'Speaker'], ans: 'C', exp: 'The President is the head of state in India.' },
      { q: 'How many members are in the Lok Sabha?', opts: ['245', '545', '745', '945'], ans: 'B', exp: 'The Lok Sabha has 545 members.' },
      { q: 'Who drafted the Indian Constitution?', opts: ['Jawaharlal Nehru', 'Dr. B.R. Ambedkar', 'Mahatma Gandhi', 'Sardar Patel'], ans: 'B', exp: 'Dr. B.R. Ambedkar was the chief architect of the Indian Constitution.' },
      { q: 'What is the Preamble of the Constitution?', opts: ['Introduction', 'Conclusion', 'Amendment', 'Article'], ans: 'A', exp: 'The Preamble is the introduction to the Indian Constitution.' },
      { q: 'How many Articles are in the Indian Constitution?', opts: ['300', '350', '395', '450'], ans: 'C', exp: 'The Indian Constitution has 395 articles.' },
      { q: 'What is the term of the President of India?', opts: ['4 years', '5 years', '6 years', '7 years'], ans: 'B', exp: 'The President of India serves a term of 5 years.' },
      { q: 'What is the Rajya Sabha?', opts: ['Lower house', 'Upper house', 'Executive body', 'Judiciary'], ans: 'B', exp: 'The Rajya Sabha is the upper house of the Indian Parliament.' },
      { q: 'What are the Fundamental Rights in the Constitution?', opts: ['Rights given by government', 'Basic rights of all citizens', 'Rights of the President', 'Rights of the Prime Minister'], ans: 'B', exp: 'Fundamental Rights are basic rights guaranteed to all citizens of India.' },
      { q: 'What is the duty of every citizen according to the Constitution?', opts: ['Pay taxes only', 'Follow laws and respect the Constitution', 'Vote only', 'Serve in the military'], ans: 'B', exp: 'Every citizen has the duty to follow laws and respect the Constitution.' }
    ],
    Economics: [
      { q: 'What is money used for?', opts: ['Decoration', 'Medium of exchange', 'Storage only', 'Nothing'], ans: 'B', exp: 'Money is used as a medium of exchange for buying and selling goods.' },
      { q: 'What is a bank?', opts: ['A shop', 'A place to keep money safe', 'A government office', 'A school'], ans: 'B', exp: 'A bank is a financial institution where people keep their money safe.' },
      { q: 'What is the currency of India?', opts: ['Dollar', 'Pound', 'Rupee', 'Euro'], ans: 'C', exp: 'The Indian Rupee (₹) is the currency of India.' },
      { q: 'What is the Reserve Bank of India?', opts: ['Commercial bank', 'Central bank of India', 'Investment bank', 'Cooperative bank'], ans: 'B', exp: 'The RBI is the central bank of India that controls the money supply.' },
      { q: 'What is trade?', opts: ['Fighting', 'Exchange of goods and services', 'Traveling', 'Learning'], ans: 'B', exp: 'Trade is the exchange of goods and services between people or countries.' },
      { q: 'What is a budget?', opts: ['A bag', 'A financial plan', 'A book', 'A tool'], ans: 'B', exp: 'A budget is a financial plan that shows income and expenses.' },
      { q: 'What is inflation?', opts: ['Increase in prices', 'Decrease in prices', 'Stable prices', 'No change in prices'], ans: 'A', exp: 'Inflation is the increase in prices of goods and services over time.' },
      { q: 'What is a resource?', opts: ['A person', 'Something useful that can be used', 'A tool', 'A machine'], ans: 'B', exp: 'A resource is anything useful that can be used to produce goods or services.' },
      { q: 'What is production?', opts: ['Buying', 'Making goods or services', 'Selling', 'Storing'], ans: 'B', exp: 'Production is the process of making goods or providing services.' },
      { q: 'What is commerce?', opts: ['Fighting', 'Buying and selling of goods', 'Learning', 'Teaching'], ans: 'B', exp: 'Commerce is the buying and selling of goods and services.' }
    ],
    Science: [
      { q: 'What is photosynthesis?', opts: ['Process of eating', 'Process of breathing', 'Process of making food using sunlight', 'Process of sleeping'], ans: 'C', exp: 'Photosynthesis is the process by which plants make food using sunlight, water, and carbon dioxide.' },
      { q: 'What are cells?', opts: ['Small rooms', 'Basic units of life', 'Tiny animals', 'Invisible objects'], ans: 'B', exp: 'Cells are the basic units of life and all living things are made of cells.' },
      { q: 'What are tissues?', opts: ['Cloth', 'Groups of similar cells', 'Organs', 'Bones'], ans: 'B', exp: 'Tissues are groups of similar cells that work together to perform a function.' },
      { q: 'What is motion?', opts: ['Staying still', 'Change in position', 'Sleeping', 'Eating'], ans: 'B', exp: 'Motion is the change in position of an object from one place to another.' },
      { q: 'What is force?', opts: ['A person', 'A push or pull', 'A tool', 'A machine'], ans: 'B', exp: 'Force is a push or pull that can change the motion or shape of an object.' },
      { q: 'What is heat?', opts: ['Cold', 'Energy that makes things warm', 'Light', 'Sound'], ans: 'B', exp: 'Heat is a form of energy that makes things warm and causes temperature to increase.' },
      { q: 'What is temperature?', opts: ['Heat', 'Measure of how hot or cold something is', 'Energy', 'Motion'], ans: 'B', exp: 'Temperature is a measure of how hot or cold something is.' },
      { q: 'What is the chemical formula of water?', opts: ['H2O', 'CO2', 'O2', 'N2'], ans: 'A', exp: 'Water has the chemical formula H2O (2 hydrogen atoms and 1 oxygen atom).' },
      { q: 'What is gravity?', opts: ['Force of attraction', 'Force of repulsion', 'Force of friction', 'Force of tension'], ans: 'A', exp: 'Gravity is the force that attracts objects towards the Earth.' },
      { q: 'What is an atom?', opts: ['Smallest unit of matter', 'Largest unit of matter', 'A type of energy', 'A type of force'], ans: 'A', exp: 'An atom is the smallest unit of matter that retains the properties of an element.' }
    ],
    Mathematics: [
      { q: 'What is 15 + 25?', opts: ['30', '35', '40', '45'], ans: 'C', exp: '15 + 25 = 40' },
      { q: 'What is 12 × 5?', opts: ['50', '55', '60', '65'], ans: 'C', exp: '12 × 5 = 60' },
      { q: 'What is 100 ÷ 4?', opts: ['20', '25', '30', '35'], ans: 'B', exp: '100 ÷ 4 = 25' },
      { q: 'What is the square of 8?', opts: ['56', '64', '72', '80'], ans: 'B', exp: '8² = 64' },
      { q: 'What is the square root of 49?', opts: ['5', '6', '7', '8'], ans: 'C', exp: '√49 = 7' },
      { q: 'What is 25% of 200?', opts: ['25', '50', '75', '100'], ans: 'B', exp: '25% of 200 = 50' },
      { q: 'What is 3/4 as a decimal?', opts: ['0.5', '0.75', '0.25', '0.9'], ans: 'B', exp: '3/4 = 0.75' },
      { q: 'What is 50 - 18?', opts: ['30', '32', '34', '36'], ans: 'B', exp: '50 - 18 = 32' },
      { q: 'What is 7 × 9?', opts: ['56', '60', '63', '70'], ans: 'C', exp: '7 × 9 = 63' },
      { q: 'What is 1/2 + 1/4?', opts: ['1/3', '1/2', '3/4', '1'], ans: 'C', exp: '1/2 + 1/4 = 2/4 + 1/4 = 3/4' }
    ]
  };

  const templates = questionTemplates[subject] || questionTemplates['History'];
  
  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    const question = {
      _id: `fallback-${subject}-${timestamp}-${i}`,
      question: template.q,
      options: template.opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${opt}`),
      correctAnswer: `${template.ans}) ${template.opts[template.ans.charCodeAt(0) - 65]}`,
      explanation: template.exp,
      subject: subject,
      difficulty: difficulty,
      type: 'fallback',
      upscRelevance: true
    };
    questions.push(question);
  }

  return questions;
}

// Submit answer & track progress
router.post('/submit', protect, async (req, res) => {
  try {
    const { questionId, selectedAnswer, timeTaken, subject, correctAnswer, explanation } = req.body;
    
    const isMockQuestion = typeof questionId === 'string' && (questionId.startsWith('fallback-') || questionId.startsWith('ai-'));
    
    let question = null;
    if (!isMockQuestion) {
      question = await Question.findById(questionId);
    }

    const isCorrect = selectedAnswer === (question?.correctAnswer || correctAnswer);
    
    if (question) {
      question.attemptCount += 1;
      if (isCorrect) question.correctCount += 1;
      await question.save();
    }

    const today = getTodayIST();
    let progress = await Progress.findOne({ userId: req.user._id, date: today });
    if (!progress) progress = new Progress({ userId: req.user._id, date: today });

    progress.questionsAttempted += 1;
    if (isCorrect) progress.questionsCorrect += 1;

    const subEntry = progress.subjectBreakdown.find(s => s.subject === subject);
    if (subEntry) { 
      subEntry.attempted += 1; 
      if (isCorrect) subEntry.correct += 1; 
    } else { 
      progress.subjectBreakdown.push({ subject, attempted: 1, correct: isCorrect ? 1 : 0 }); 
    }

    await progress.save();

    const updateObj = { $inc: { totalQuestionsAttempted: 1, totalCorrect: isCorrect ? 1 : 0 } };
    if (isCorrect && !isMockQuestion) updateObj.$addToSet = { masteredQuestions: questionId };
    await User.findByIdAndUpdate(req.user._id, updateObj);

    await Activity.create({
      userId: req.user._id,
      userName: req.user.name,
      userClass: req.user.currentClass,
      activityType: 'question_solved',
      subject: subject,
      topic: question?.topic || 'Daily Practice',
      isCorrect: isCorrect,
      details: {
        questionId: questionId,
        difficulty: question?.difficulty || 'beginner',
        timeTaken: timeTaken,
        isMockQuestion: isMockQuestion
      }
    });

    res.json({ isCorrect, correctAnswer: question?.correctAnswer || correctAnswer, explanation: question?.explanation || explanation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Add question
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Bulk add questions
router.post('/bulk', protect, adminOnly, async (req, res) => {
  try {
    const questions = await Question.insertMany(req.body.questions);
    res.status(201).json({ inserted: questions.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update question
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(q);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Delete question
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Question.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Question deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
