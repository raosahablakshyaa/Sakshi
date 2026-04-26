const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const axios = require('axios');

const NCERT_STRUCTURE = {
  history: {
    label: 'History', icon: '🏛️',
    classes: {
      6: ['What, Where, How and When?', 'On The Trail of the Earliest People', 'From Gathering to Growing Food', 'In the Earliest Cities', 'What Books and Burials Tell Us', 'Kingdoms, Kings and an Early Republic', 'New Questions and Ideas', 'Ashoka, The Emperor Who Gave Up War', 'Vital Villages, Thriving Towns', 'Traders, Kings and Pilgrims', 'New Empires and Kingdoms', 'Buildings, Paintings and Books'],
      7: ['Tracing Changes Through a Thousand Years', 'New Kings and Kingdoms', 'The Delhi Sultans', 'The Mughal Empire', 'Rulers and Buildings', 'Towns, Traders and Craftspersons', 'Tribes, Nomads and Settled Communities', 'Devotional Paths to the Divine', 'The Making of Regional Cultures', 'Eighteenth-Century Political Formations'],
      8: ['How, When and Where', 'From Trade to Territory', 'Ruling the Countryside', 'Tribals, Dikus and the Vision of a Golden Age', 'When People Rebel', 'Weavers, Iron Smelters and Factory Owners', 'Civilising the "Native", Educating the Nation', 'Women, Caste and Reform', 'The Making of the National Movement', 'India After Independence'],
      9: ['The French Revolution', 'Socialism in Europe and the Russian Revolution', 'Nazism and the Rise of Hitler', 'Forest Society and Colonialism', 'Pastoralists in the Modern World'],
      10: ['The Rise of Nationalism in Europe', 'Nationalism in India', 'The Making of a Global World', 'The Age of Industrialisation', 'Print Culture and the Modern World'],
      11: ['From the Beginning of Time', 'Early Societies', 'An Empire Across Three Continents', 'The Central Islamic Lands', 'Nomadic Empires', 'The Three Orders', 'Changing Cultural Traditions', 'Confrontation of Cultures', 'The Industrial Revolution', 'Displacing Indigenous Peoples', 'Paths to Modernisation'],
      12: ['Bricks, Beads and Bones', 'Kings, Farmers and Towns', 'Kinship, Caste and Class', 'Thinkers, Beliefs and Buildings', 'Through the Eyes of Travellers', 'Bhakti-Sufi Traditions', 'An Imperial Capital: Vijayanagara', 'Peasants, Zamindars and the State', 'Kings and Chronicles', 'Colonialism and the Countryside', 'Rebels and the Raj', 'Colonial Cities', 'Mahatma Gandhi and the Nationalist Movement', 'Understanding Partition', 'Framing the Constitution']
    }
  },
  geography: {
    label: 'Geography', icon: '🌍',
    classes: {
      6: ['The Earth in the Solar System', 'Globe: Latitudes and Longitudes', 'Motions of the Earth', 'Maps', 'Major Domains of the Earth', 'Major Landforms of the Earth', 'Our Country – India', 'India: Climate, Vegetation and Wildlife'],
      7: ['Environment', 'Inside Our Earth', 'Our Changing Earth', 'Air', 'Water', 'Natural Vegetation and Wildlife', 'Human Environment – Settlement, Transport and Communication', 'Human-Environment Interactions', 'Life in the Temperate Grasslands', 'Life in the Deserts'],
      8: ['Resources', 'Land, Soil, Water, Natural Vegetation and Wildlife Resources', 'Mineral and Power Resources', 'Agriculture', 'Industries', 'Human Resources'],
      9: ['India – Size and Location', 'Physical Features of India', 'Drainage', 'Climate', 'Natural Vegetation and Wildlife', 'Population'],
      10: ['Resources and Development', 'Forest and Wildlife Resources', 'Water Resources', 'Agriculture', 'Minerals and Energy Resources', 'Manufacturing Industries', 'Lifelines of National Economy'],
      11: ['Geography as a Discipline', 'The Origin and Evolution of the Earth', 'Interior of the Earth', 'Distribution of Oceans and Continents', 'Minerals and Rocks', 'Geomorphic Processes', 'Landforms and their Evolution', 'Composition and Structure of Atmosphere', 'Solar Radiation, Heat Balance and Temperature', 'Atmospheric Circulation and Weather Systems', 'Water in the Atmosphere', 'World Climate and Climate Change', 'Water (Oceans)', 'Movements of Ocean Water', 'Life on the Earth', 'Biodiversity and Conservation'],
      12: ['Population: Distribution, Density, Growth and Composition', 'Migration: Types, Causes and Consequences', 'Human Development', 'Human Settlements', 'Land Resources and Agriculture', 'Water Resources', 'Mineral and Energy Resources', 'Manufacturing Industries', 'Planning and Sustainable Development', 'Transport and Communication', 'International Trade', 'Geographical Perspective on Selected Issues and Problems']
    }
  },
  polity: {
    label: 'Political Science', icon: '⚖️',
    classes: {
      6: ['Understanding Diversity', 'Diversity and Discrimination', 'What is Government?', 'Key Elements of a Democratic Government', 'Panchayati Raj', 'Rural Administration', 'Urban Administration', 'Rural Livelihoods', 'Urban Livelihoods'],
      7: ['On Equality', 'Role of the Government in Health', 'How the State Government Works', 'Growing up as Boys and Girls', 'Women Change the World', 'Understanding Media', 'Understanding Advertising', 'Markets Around Us', 'A Shirt in the Market'],
      8: ['The Indian Constitution', 'Understanding Secularism', 'Why Do We Need a Parliament?', 'Understanding Laws', 'Judiciary', 'Understanding Our Criminal Justice System', 'Understanding Marginalisation', 'Confronting Marginalisation', 'Public Facilities', 'Law and Social Justice'],
      9: ['What is Democracy? Why Democracy?', 'Constitutional Design', 'Electoral Politics', 'Working of Institutions', 'Democratic Rights'],
      10: ['Power Sharing', 'Federalism', 'Democracy and Diversity', 'Gender, Religion and Caste', 'Popular Struggles and Movements', 'Political Parties', 'Outcomes of Democracy', 'Challenges to Democracy'],
      11: ['Constitution: Why and How?', 'Rights in the Indian Constitution', 'Election and Representation', 'Executive', 'Legislature', 'Judiciary', 'Federalism', 'Local Governments', 'Constitution as a Living Document', 'The Philosophy of the Constitution'],
      12: ['Challenges of Nation Building', 'Era of One-Party Dominance', 'Politics of Planned Development', 'India\'s External Relations', 'Challenges to and Restoration of the Congress System', 'The Crisis of Democratic Order', 'Rise of Popular Movements', 'Regional Aspirations', 'Recent Developments in Indian Politics']
    }
  },
  economics: {
    label: 'Economics', icon: '📊',
    classes: {
      9: ['The Story of Village Palampur', 'People as Resource', 'Poverty as a Challenge', 'Food Security in India'],
      10: ['Development', 'Sectors of the Indian Economy', 'Money and Credit', 'Globalisation and the Indian Economy', 'Consumer Rights'],
      11: ['Introduction to Economics', 'Collection, Organisation and Presentation of Data', 'Statistical Tools and Interpretation', 'Developing Projects in Economics'],
      12: ['Introduction to Macroeconomics', 'National Income Accounting', 'Money and Banking', 'Determination of Income and Employment', 'Government Budget and the Economy', 'Open Economy Macroeconomics']
    }
  },
  science: {
    label: 'Science', icon: '🔬',
    classes: {
      6: ['Food: Where Does It Come From?', 'Components of Food', 'Fibre to Fabric', 'Sorting Materials into Groups', 'Separation of Substances', 'Changes Around Us', 'Getting to Know Plants', 'Body Movements', 'The Living Organisms and Their Surroundings', 'Motion and Measurement of Distances', 'Light, Shadows and Reflections', 'Electricity and Circuits', 'Fun with Magnets', 'Water', 'Air Around Us', 'Garbage In, Garbage Out'],
      7: ['Nutrition in Plants', 'Nutrition in Animals', 'Fibre to Fabric', 'Heat', 'Acids, Bases and Salts', 'Physical and Chemical Changes', 'Weather, Climate and Adaptations', 'Winds, Storms and Cyclones', 'Soil', 'Respiration in Organisms', 'Transportation in Animals and Plants', 'Reproduction in Plants', 'Motion and Time', 'Electric Current and Its Effects', 'Light', 'Water: A Precious Resource', 'Forests: Our Lifeline', 'Wastewater Story'],
      8: ['Crop Production and Management', 'Microorganisms', 'Synthetic Fibres and Plastics', 'Materials: Metals and Non-Metals', 'Coal and Petroleum', 'Combustion and Flame', 'Conservation of Plants and Animals', 'Cell Structure and Functions', 'Reproduction in Animals', 'Reaching the Age of Adolescence', 'Force and Pressure', 'Friction', 'Sound', 'Chemical Effects of Electric Current', 'Some Natural Phenomena', 'Light', 'Stars and the Solar System', 'Pollution of Air and Water'],
      9: ['Matter in Our Surroundings', 'Is Matter Around Us Pure?', 'Atoms and Molecules', 'Structure of the Atom', 'The Fundamental Unit of Life', 'Tissues', 'Diversity in Living Organisms', 'Motion', 'Force and Laws of Motion', 'Gravitation', 'Work and Energy', 'Sound', 'Why Do We Fall Ill?', 'Natural Resources', 'Improvement in Food Resources'],
      10: ['Chemical Reactions and Equations', 'Acids, Bases and Salts', 'Metals and Non-metals', 'Carbon and its Compounds', 'Life Processes', 'Control and Coordination', 'How do Organisms Reproduce?', 'Heredity and Evolution', 'Light – Reflection and Refraction', 'Human Eye and Colourful World', 'Electricity', 'Magnetic Effects of Electric Current', 'Our Environment', 'Management of Natural Resources']
    }
  }
};

async function callAI(prompt, maxTokens = 2000) {
  try {
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      { model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], temperature: 0.4, max_tokens: maxTokens },
      { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }, timeout: 30000 }
    );
    return res.data.choices[0].message.content;
  } catch {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4, maxOutputTokens: maxTokens } },
      { timeout: 30000 }
    );
    return res.data.candidates[0].content.parts[0].text;
  }
}

// Get NCERT structure
router.get('/structure', protect, (req, res) => res.json(NCERT_STRUCTURE));

// Get chapters for subject + class
router.get('/chapters', protect, (req, res) => {
  const { subject, class: cls } = req.query;
  if (!subject || !cls) return res.status(400).json({ message: 'subject and class required' });
  const subjectData = NCERT_STRUCTURE[subject];
  if (!subjectData) return res.status(404).json({ message: 'Subject not found' });
  const chapters = subjectData.classes[parseInt(cls)];
  if (!chapters) return res.status(404).json({ message: 'Class not found for this subject' });
  res.json({ subject, class: parseInt(cls), chapters: chapters.map((title, i) => ({ index: i + 1, title })) });
});

// Full chapter content: overview + key concepts + important facts + UPSC connection + summary
router.post('/overview', protect, async (req, res) => {
  try {
    const { subject, chapter, class: cls } = req.body;
    const prompt = `You are an expert UPSC educator. Give a COMPLETE and DETAILED chapter overview for:
Subject: ${subject} | Class: ${cls} | Chapter: "${chapter}"

Structure your response EXACTLY like this:

## 📖 Chapter Overview
[3-4 lines explaining what this chapter is about and why it matters]

## 🎯 What You Will Learn
[5-6 bullet points of main learning outcomes]

## 📚 Key Concepts & Explanations
[Explain each major concept in 3-5 lines with examples. Cover ALL important topics from this chapter thoroughly]

## 🔑 Important Facts & Dates
[10-15 specific facts, dates, names, events that are frequently asked]

## 🗺️ Mind Map / Chapter Flow
[Show how concepts connect: Concept A → leads to → Concept B → results in → Concept C]

## 🇮🇳 UPSC Relevance & GS Connection
[Which GS Paper, which topics, how this chapter connects to UPSC Prelims and Mains]

## ⚡ Quick Revision — 10 One-Liners
[10 crisp one-line facts for last-minute revision]

## 💡 Common Mistakes Students Make
[3-4 common misconceptions or errors to avoid]

Be thorough, detailed and exam-focused. This is for a serious IAS aspirant.`;

    const reply = await callAI(prompt, 3000);
    res.json({ overview: reply, subject, chapter, class: cls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PYQs — all previous year questions from this chapter
router.post('/pyqs', protect, async (req, res) => {
  try {
    const { subject, chapter, class: cls } = req.body;
    const prompt = `You are a UPSC PYQ expert. Generate ALL important Previous Year Questions (PYQs) that have been asked from NCERT ${subject} Class ${cls} chapter "${chapter}" in UPSC Prelims and Mains exams from 1979 to 2024.

Return ONLY a JSON array in this exact format:
[
  {
    "year": 2019,
    "exam": "UPSC Prelims",
    "paper": "GS Paper 1",
    "question": "Full question text here",
    "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
    "correctAnswer": "A) option1",
    "explanation": "Detailed explanation of why this answer is correct and what concept it tests",
    "difficulty": "easy/medium/hard",
    "topic": "specific topic within the chapter"
  }
]

Include:
- UPSC Prelims MCQs (with options)
- UPSC Mains questions (options array will be empty [], correctAnswer will be "Subjective")
- State PSC questions if highly relevant
- Questions from 1979 to 2024

Generate at least 15-20 questions. If fewer actual PYQs exist, add highly probable exam questions based on the chapter's importance. Mark those with year: 0 and exam: "Expected Question".

Return ONLY the JSON array, no other text.`;

    const reply = await callAI(prompt, 3000);
    const jsonMatch = reply.match(/\[[\s\S]*\]/);
    const pyqs = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    res.json({ pyqs, subject, chapter, class: cls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// AI summary (kept for backward compat)
router.post('/summary', protect, async (req, res) => {
  try {
    const { subject, chapter, class: cls } = req.body;
    const prompt = `Create a concise NCERT study summary for:
Subject: ${subject} | Class: ${cls} | Chapter: "${chapter}"

## Overview
## Key Concepts
## Important Facts
## UPSC Connection
## Quick Revision (5 points)

Keep it crisp and exam-focused.`;
    const reply = await callAI(prompt, 1500);
    res.json({ summary: reply, subject, chapter, class: cls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Flashcards
router.post('/flashcards', protect, async (req, res) => {
  try {
    const { subject, chapter, class: cls } = req.body;
    const prompt = `Generate 10 high-quality flashcards for NCERT ${subject} Class ${cls} - "${chapter}".
Focus on facts important for UPSC Prelims and school exams.
Return ONLY a JSON array: [{"front": "question/term", "back": "answer/definition", "difficulty": "easy/medium/hard"}]`;
    const reply = await callAI(prompt, 1500);
    const jsonMatch = reply.match(/\[[\s\S]*\]/);
    const flashcards = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    res.json({ flashcards, subject, chapter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
