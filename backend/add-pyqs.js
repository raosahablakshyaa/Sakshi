require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const sampleQuestions = [
  // Class 7 - History
  {
    subject: 'History',
    topic: 'Tracing Changes Through a Thousand Years',
    class: 7,
    difficulty: 'beginner',
    type: 'mcq',
    question: 'Which of the following was the capital of the Delhi Sultanate?',
    options: ['A) Agra', 'B) Delhi', 'C) Lahore', 'D) Multan'],
    correctAnswer: 'B) Delhi',
    explanation: 'Delhi was the capital of the Delhi Sultanate from 1206 to 1526 CE.',
    year: 2022,
    exam: 'CBSE Class 7 2022'
  },
  {
    subject: 'History',
    topic: 'The Mughal Empire',
    class: 7,
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'Who was the founder of the Mughal Empire?',
    options: ['A) Akbar', 'B) Babur', 'C) Aurangzeb', 'D) Shah Jahan'],
    correctAnswer: 'B) Babur',
    explanation: 'Babur founded the Mughal Empire in 1526 after defeating Ibrahim Lodi at the Battle of Panipat.',
    year: 2021,
    exam: 'CBSE Class 7 2021'
  },
  // Class 7 - Geography
  {
    subject: 'Geography',
    topic: 'Environment',
    class: 7,
    difficulty: 'beginner',
    type: 'mcq',
    question: 'Which layer of the atmosphere contains the ozone layer?',
    options: ['A) Troposphere', 'B) Stratosphere', 'C) Mesosphere', 'D) Thermosphere'],
    correctAnswer: 'B) Stratosphere',
    explanation: 'The stratosphere contains the ozone layer which protects Earth from harmful UV radiation.',
    year: 2023,
    exam: 'CBSE Class 7 2023'
  },
  // Class 7 - Science
  {
    subject: 'Science',
    topic: 'Nutrition in Plants',
    class: 7,
    difficulty: 'beginner',
    type: 'mcq',
    question: 'What is the process by which plants make their own food?',
    options: ['A) Respiration', 'B) Photosynthesis', 'C) Digestion', 'D) Fermentation'],
    correctAnswer: 'B) Photosynthesis',
    explanation: 'Photosynthesis is the process where plants use sunlight, water, and CO2 to make glucose.',
    year: 2022,
    exam: 'CBSE Class 7 2022'
  },
  // Class 7 - Polity
  {
    subject: 'Political Science',
    topic: 'On Equality',
    class: 7,
    difficulty: 'beginner',
    type: 'mcq',
    question: 'Which article of the Indian Constitution guarantees equality before law?',
    options: ['A) Article 14', 'B) Article 15', 'C) Article 16', 'D) Article 17'],
    correctAnswer: 'A) Article 14',
    explanation: 'Article 14 guarantees equality before law and equal protection of laws to all persons.',
    year: 2023,
    exam: 'CBSE Class 7 2023'
  },
  // Class 8 - History
  {
    subject: 'History',
    topic: 'From Trade to Territory',
    class: 8,
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'Which company established the first trading post in India?',
    options: ['A) Dutch East India Company', 'B) British East India Company', 'C) French East India Company', 'D) Portuguese East India Company'],
    correctAnswer: 'D) Portuguese East India Company',
    explanation: 'The Portuguese established the first European trading post in Calicut in 1498.',
    year: 2022,
    exam: 'CBSE Class 8 2022'
  },
  // Class 8 - Science
  {
    subject: 'Science',
    topic: 'Microorganisms',
    class: 8,
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'Which of the following is a unicellular organism?',
    options: ['A) Amoeba', 'B) Paramecium', 'C) Bacteria', 'D) All of the above'],
    correctAnswer: 'D) All of the above',
    explanation: 'Amoeba, Paramecium, and Bacteria are all unicellular organisms.',
    year: 2023,
    exam: 'CBSE Class 8 2023'
  },
  // Class 9 - History
  {
    subject: 'History',
    topic: 'The French Revolution',
    class: 9,
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'In which year did the French Revolution begin?',
    options: ['A) 1787', 'B) 1789', 'C) 1791', 'D) 1793'],
    correctAnswer: 'B) 1789',
    explanation: 'The French Revolution began in 1789 with the storming of the Bastille.',
    year: 2021,
    exam: 'CBSE Class 9 2021'
  },
  // Class 9 - Science
  {
    subject: 'Science',
    topic: 'Matter in Our Surroundings',
    class: 9,
    difficulty: 'beginner',
    type: 'mcq',
    question: 'What is the SI unit of temperature?',
    options: ['A) Celsius', 'B) Fahrenheit', 'C) Kelvin', 'D) Rankine'],
    correctAnswer: 'C) Kelvin',
    explanation: 'Kelvin is the SI unit of temperature used in scientific measurements.',
    year: 2022,
    exam: 'CBSE Class 9 2022'
  },
  // Class 10 - History
  {
    subject: 'History',
    topic: 'The Rise of Nationalism in Europe',
    class: 10,
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'Which country was unified by Otto von Bismarck?',
    options: ['A) Italy', 'B) Germany', 'C) France', 'D) Austria'],
    correctAnswer: 'B) Germany',
    explanation: 'Otto von Bismarck unified Germany through a series of wars in the 1860s-1870s.',
    year: 2023,
    exam: 'CBSE Class 10 2023'
  },
  // Class 10 - Science
  {
    subject: 'Science',
    topic: 'Chemical Reactions and Equations',
    class: 10,
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'What is the chemical formula for rust?',
    options: ['A) Fe2O3', 'B) FeO', 'C) Fe3O4', 'D) Fe2O3.xH2O'],
    correctAnswer: 'D) Fe2O3.xH2O',
    explanation: 'Rust is hydrated iron oxide with the formula Fe2O3.xH2O.',
    year: 2022,
    exam: 'CBSE Class 10 2022'
  },
  // Class 10 - Maths
  {
    subject: 'Mathematics',
    topic: 'Real Numbers',
    class: 10,
    difficulty: 'beginner',
    type: 'mcq',
    question: 'What is the HCF of 12 and 18?',
    options: ['A) 2', 'B) 3', 'C) 6', 'D) 12'],
    correctAnswer: 'C) 6',
    explanation: 'The HCF (Highest Common Factor) of 12 and 18 is 6.',
    year: 2023,
    exam: 'CBSE Class 10 2023'
  },
  // Class 11 - History
  {
    subject: 'History',
    topic: 'From the Beginning of Time',
    class: 11,
    difficulty: 'advanced',
    type: 'mcq',
    question: 'Which civilization is known as the "Cradle of Civilization"?',
    options: ['A) Egyptian', 'B) Mesopotamian', 'C) Indus Valley', 'D) Chinese'],
    correctAnswer: 'B) Mesopotamian',
    explanation: 'Mesopotamia is often called the Cradle of Civilization as it was one of the earliest civilizations.',
    year: 2021,
    exam: 'CBSE Class 11 2021'
  },
  // Class 12 - History
  {
    subject: 'History',
    topic: 'Bricks, Beads and Bones',
    class: 12,
    difficulty: 'advanced',
    type: 'mcq',
    question: 'Which city was the capital of the Indus Valley Civilization?',
    options: ['A) Harappa', 'B) Mohenjo-daro', 'C) Kalibangan', 'D) Dholavira'],
    correctAnswer: 'B) Mohenjo-daro',
    explanation: 'Mohenjo-daro was one of the major cities and likely the capital of the Indus Valley Civilization.',
    year: 2022,
    exam: 'CBSE Class 12 2022'
  },
  // Class 12 - Science
  {
    subject: 'Science',
    topic: 'Reproduction in Organisms',
    class: 12,
    difficulty: 'advanced',
    type: 'mcq',
    question: 'What is the process of formation of gametes called?',
    options: ['A) Mitosis', 'B) Meiosis', 'C) Fertilization', 'D) Germination'],
    correctAnswer: 'B) Meiosis',
    explanation: 'Meiosis is the process of cell division that produces gametes (sex cells).',
    year: 2023,
    exam: 'CBSE Class 12 2023'
  },
  // Class 12 - Maths
  {
    subject: 'Mathematics',
    topic: 'Relations and Functions',
    class: 12,
    difficulty: 'advanced',
    type: 'mcq',
    question: 'If f(x) = 2x + 3, what is f(5)?',
    options: ['A) 10', 'B) 13', 'C) 15', 'D) 18'],
    correctAnswer: 'B) 13',
    explanation: 'f(5) = 2(5) + 3 = 10 + 3 = 13',
    year: 2022,
    exam: 'CBSE Class 12 2022'
  }
];

async function addSampleQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('🗑️ Cleared existing questions');

    // Insert sample questions
    const inserted = await Question.insertMany(sampleQuestions);
    console.log(`✅ Added ${inserted.length} sample PYQs`);
    console.log('\n📚 Questions added by class:');
    console.log('- Class 7: History, Geography, Science, Polity');
    console.log('- Class 8: History, Science');
    console.log('- Class 9: History, Science');
    console.log('- Class 10: History, Science, Mathematics');
    console.log('- Class 11: History');
    console.log('- Class 12: History, Science, Mathematics');

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

addSampleQuestions();
