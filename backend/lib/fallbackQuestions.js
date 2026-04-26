// Fallback questions when AI API is unavailable
const fallbackQuestions = {
  History: [
    {
      question: "Who was the first Mughal Emperor of India?",
      options: ["A) Akbar", "B) Babur", "C) Humayun", "D) Shah Jahan"],
      correctAnswer: "B) Babur",
      explanation: "Babur founded the Mughal Empire in 1526 after defeating Ibrahim Lodi at the Battle of Panipat.",
      topic: "Mughal Empire",
      upscRelevance: true
    },
    {
      question: "In which year did the Battle of Plassey take place?",
      options: ["A) 1757", "B) 1764", "C) 1775", "D) 1857"],
      correctAnswer: "A) 1757",
      explanation: "The Battle of Plassey in 1757 was a decisive victory for the British East India Company under Robert Clive against the Nawab of Bengal.",
      topic: "British Rule",
      upscRelevance: true
    },
    {
      question: "Who wrote the Arthashastra?",
      options: ["A) Kautilya", "B) Vatsyayana", "C) Panini", "D) Aryabhata"],
      correctAnswer: "A) Kautilya",
      explanation: "Kautilya (also known as Chanakya) wrote the Arthashastra, an ancient Indian treatise on statecraft and economics.",
      topic: "Ancient India",
      upscRelevance: true
    },
    {
      question: "Which Mughal emperor built the Taj Mahal?",
      options: ["A) Akbar", "B) Jahangir", "C) Shah Jahan", "D) Aurangzeb"],
      correctAnswer: "C) Shah Jahan",
      explanation: "Shah Jahan built the Taj Mahal in Agra as a mausoleum for his wife Mumtaz Mahal.",
      topic: "Mughal Architecture",
      upscRelevance: true
    },
    {
      question: "Who was the founder of the Mauryan Empire?",
      options: ["A) Ashoka", "B) Chandragupta Maurya", "C) Bindusara", "D) Brihadratha"],
      correctAnswer: "B) Chandragupta Maurya",
      explanation: "Chandragupta Maurya founded the Mauryan Empire around 322 BCE with the help of Kautilya.",
      topic: "Ancient India",
      upscRelevance: true
    }
  ],
  Geography: [
    {
      question: "Which is the longest river in India?",
      options: ["A) Brahmaputra", "B) Ganges", "C) Godavari", "D) Yamuna"],
      correctAnswer: "B) Ganges",
      explanation: "The Ganges River is the longest river in India, flowing for about 2,525 km from the Himalayas to the Bay of Bengal.",
      topic: "Rivers",
      upscRelevance: true
    },
    {
      question: "Which mountain range is known as the 'Spine of India'?",
      options: ["A) Himalayas", "B) Western Ghats", "C) Eastern Ghats", "D) Vindhyas"],
      correctAnswer: "A) Himalayas",
      explanation: "The Himalayas form the northern boundary of India and are often referred to as the 'Spine of India'.",
      topic: "Mountains",
      upscRelevance: true
    },
    {
      question: "Which state has the longest coastline in India?",
      options: ["A) Gujarat", "B) Maharashtra", "C) Tamil Nadu", "D) Andhra Pradesh"],
      correctAnswer: "A) Gujarat",
      explanation: "Gujarat has the longest coastline among Indian states, stretching approximately 1,600 km.",
      topic: "Coastal Geography",
      upscRelevance: true
    },
    {
      question: "What is the capital of India?",
      options: ["A) Mumbai", "B) New Delhi", "C) Bangalore", "D) Kolkata"],
      correctAnswer: "B) New Delhi",
      explanation: "New Delhi is the capital of India and serves as the seat of the Indian government.",
      topic: "Political Geography",
      upscRelevance: true
    },
    {
      question: "Which desert is located in Rajasthan?",
      options: ["A) Kalahari", "B) Sahara", "C) Thar", "D) Gobi"],
      correctAnswer: "C) Thar",
      explanation: "The Thar Desert, also known as the Great Indian Desert, is located in Rajasthan and parts of Gujarat.",
      topic: "Deserts",
      upscRelevance: true
    }
  ],
  "Political Science": [
    {
      question: "How many articles are there in the Indian Constitution?",
      options: ["A) 395", "B) 396", "C) 397", "D) 398"],
      correctAnswer: "A) 395",
      explanation: "The Indian Constitution originally had 395 articles. It now has 470 articles after various amendments.",
      topic: "Constitution",
      upscRelevance: true
    },
    {
      question: "Who is the head of state in India?",
      options: ["A) Prime Minister", "B) President", "C) Chief Justice", "D) Speaker"],
      correctAnswer: "B) President",
      explanation: "The President of India is the head of state and the supreme commander of the armed forces.",
      topic: "Government Structure",
      upscRelevance: true
    },
    {
      question: "How many states are there in India?",
      options: ["A) 26", "B) 28", "C) 29", "D) 30"],
      correctAnswer: "B) 28",
      explanation: "India has 28 states and 8 union territories as of 2024.",
      topic: "Political Division",
      upscRelevance: true
    },
    {
      question: "What is the term of a Lok Sabha member?",
      options: ["A) 4 years", "B) 5 years", "C) 6 years", "D) 7 years"],
      correctAnswer: "B) 5 years",
      explanation: "Members of the Lok Sabha (lower house) serve a term of 5 years.",
      topic: "Parliament",
      upscRelevance: true
    },
    {
      question: "Which article of the Constitution deals with Fundamental Rights?",
      options: ["A) Article 12-35", "B) Article 36-51", "C) Article 52-62", "D) Article 63-73"],
      correctAnswer: "A) Article 12-35",
      explanation: "Articles 12 to 35 of the Indian Constitution deal with Fundamental Rights.",
      topic: "Constitution",
      upscRelevance: true
    }
  ],
  Economics: [
    {
      question: "What is the currency of India?",
      options: ["A) Dollar", "B) Pound", "C) Indian Rupee", "D) Euro"],
      correctAnswer: "C) Indian Rupee",
      explanation: "The Indian Rupee (₹) is the official currency of India, with the currency code INR.",
      topic: "Currency",
      upscRelevance: true
    },
    {
      question: "Which organization publishes the Human Development Index?",
      options: ["A) World Bank", "B) IMF", "C) UNDP", "D) WTO"],
      correctAnswer: "C) UNDP",
      explanation: "The United Nations Development Programme (UNDP) publishes the Human Development Index annually.",
      topic: "Development",
      upscRelevance: true
    },
    {
      question: "What does GDP stand for?",
      options: ["A) Gross Domestic Product", "B) Gross Development Plan", "C) General Domestic Policy", "D) Global Development Program"],
      correctAnswer: "A) Gross Domestic Product",
      explanation: "GDP (Gross Domestic Product) is the total monetary value of goods and services produced in a country.",
      topic: "Macroeconomics",
      upscRelevance: true
    },
    {
      question: "Who is the current Governor of the Reserve Bank of India?",
      options: ["A) Raghuram Rajan", "B) Urjit Patel", "C) Shaktikanta Das", "D) Sanjay Malhotra"],
      correctAnswer: "D) Sanjay Malhotra",
      explanation: "Sanjay Malhotra is the current Governor of the Reserve Bank of India (as of 2024).",
      topic: "RBI",
      upscRelevance: true
    },
    {
      question: "What is inflation?",
      options: ["A) Decrease in prices", "B) Increase in prices", "C) Stable prices", "D) No change in prices"],
      correctAnswer: "B) Increase in prices",
      explanation: "Inflation is the sustained increase in the general price level of goods and services in an economy.",
      topic: "Macroeconomics",
      upscRelevance: true
    }
  ],
  Science: [
    {
      question: "What is the chemical symbol for Gold?",
      options: ["A) Go", "B) Gd", "C) Au", "D) Ag"],
      correctAnswer: "C) Au",
      explanation: "The chemical symbol for Gold is Au, derived from its Latin name 'Aurum'.",
      topic: "Chemistry",
      upscRelevance: false
    },
    {
      question: "How many bones are there in the human body?",
      options: ["A) 186", "B) 206", "C) 226", "D) 246"],
      correctAnswer: "B) 206",
      explanation: "An adult human body has 206 bones. Babies are born with about 270 bones, many of which are made of cartilage.",
      topic: "Biology",
      upscRelevance: false
    },
    {
      question: "What is the speed of light?",
      options: ["A) 3 × 10^8 m/s", "B) 3 × 10^7 m/s", "C) 3 × 10^9 m/s", "D) 3 × 10^6 m/s"],
      correctAnswer: "A) 3 × 10^8 m/s",
      explanation: "The speed of light in vacuum is approximately 3 × 10^8 meters per second or 299,792,458 m/s.",
      topic: "Physics",
      upscRelevance: false
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["A) Venus", "B) Mars", "C) Jupiter", "D) Saturn"],
      correctAnswer: "B) Mars",
      explanation: "Mars is known as the Red Planet due to the presence of iron oxide (rust) on its surface.",
      topic: "Astronomy",
      upscRelevance: false
    },
    {
      question: "What is the process by which plants make their own food?",
      options: ["A) Respiration", "B) Photosynthesis", "C) Fermentation", "D) Digestion"],
      correctAnswer: "B) Photosynthesis",
      explanation: "Photosynthesis is the process by which plants convert sunlight, water, and carbon dioxide into glucose and oxygen.",
      topic: "Biology",
      upscRelevance: false
    }
  ],
  Mathematics: [
    {
      question: "What is the value of π (pi) approximately?",
      options: ["A) 2.14", "B) 3.14", "C) 4.14", "D) 5.14"],
      correctAnswer: "B) 3.14",
      explanation: "π (pi) is approximately 3.14159... It is the ratio of a circle's circumference to its diameter.",
      topic: "Geometry",
      upscRelevance: false
    },
    {
      question: "What is the square root of 144?",
      options: ["A) 10", "B) 11", "C) 12", "D) 13"],
      correctAnswer: "C) 12",
      explanation: "The square root of 144 is 12, because 12 × 12 = 144.",
      topic: "Algebra",
      upscRelevance: false
    },
    {
      question: "What is the sum of angles in a triangle?",
      options: ["A) 90°", "B) 180°", "C) 270°", "D) 360°"],
      correctAnswer: "B) 180°",
      explanation: "The sum of all interior angles in a triangle is always 180 degrees.",
      topic: "Geometry",
      upscRelevance: false
    },
    {
      question: "What is 15% of 200?",
      options: ["A) 20", "B) 25", "C) 30", "D) 35"],
      correctAnswer: "C) 30",
      explanation: "15% of 200 = (15/100) × 200 = 0.15 × 200 = 30.",
      topic: "Percentage",
      upscRelevance: false
    },
    {
      question: "What is the area of a circle with radius 5?",
      options: ["A) 25π", "B) 50π", "C) 75π", "D) 100π"],
      correctAnswer: "A) 25π",
      explanation: "The area of a circle is πr². With radius 5, area = π × 5² = 25π.",
      topic: "Geometry",
      upscRelevance: false
    }
  ]
};

// Function to get random fallback questions
function getRandomFallbackQuestions(subject, count = 10, difficulty = 'beginner') {
  const questions = fallbackQuestions[subject] || fallbackQuestions.History;
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  
  return shuffled.slice(0, Math.min(count, shuffled.length)).map((q, idx) => ({
    ...q,
    _id: `fallback-${Date.now()}-${idx}`,
    subject: subject,
    difficulty: difficulty,
    class: 7,
    type: 'mcq',
    isActive: true,
    year: new Date().getFullYear(),
    exam: 'Fallback'
  }));
}

module.exports = {
  fallbackQuestions,
  getRandomFallbackQuestions
};
