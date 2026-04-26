const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { callAI } = require('../lib/aiUtils');
const chapterOverviews = require('../lib/chapterData');
const { getRandomPYQs } = require('../lib/pyqBank');
const chapterContent = require('../lib/chapterContent');

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

router.get('/structure', protect, (req, res) => res.json(NCERT_STRUCTURE));

router.get('/chapters', protect, (req, res) => {
  const subject = req.query.subject;
  const classNum = req.query.class || req.query.classNum;
  
  if (!subject || !classNum) return res.status(400).json({ message: 'subject and class required' });
  
  const subjectData = NCERT_STRUCTURE[subject];
  if (!subjectData) return res.status(404).json({ message: 'Subject not found' });
  
  const chapters = subjectData.classes[parseInt(classNum)];
  if (!chapters) return res.status(404).json({ message: 'Class not found for this subject' });
  
  res.json({ subject, class: parseInt(classNum), chapters: chapters.map((title, i) => ({ index: i + 1, title })) });
});

router.post('/overview', protect, async (req, res) => {
  try {
    const { subject, chapter, class: cls } = req.body;
    const prompt = `You are an expert UPSC educator. Give a FOCUSED chapter overview for:\nSubject: ${subject} | Class: ${cls} | Chapter: "${chapter}"\n\nStructure your response EXACTLY like this:\n\n## 📖 Chapter Overview\n[2-3 lines explaining ONLY what's important for UPSC - skip general intro]\n\n## 🎯 UPSC Key Topics\n[5-6 bullet points of ONLY topics that appear in UPSC Prelims/Mains - be specific]\n\n## 📚 Critical Concepts for UPSC\n[Explain ONLY the 4-5 most important concepts that are frequently asked in UPSC exams. Each concept: 2-3 lines with specific examples]\n\n## 🔑 Important Facts & Dates (UPSC Focus)\n[10-12 specific facts, dates, names, events that are ACTUALLY asked in UPSC exams - no filler]\n\n## 🗺️ UPSC Connection Map\n[Show how this chapter connects to: GS Paper 1 topics, Mains essay themes, Prelims MCQs]\n\n## ⚡ Quick Revision — 10 One-Liners\n[10 crisp one-line facts that are UPSC-relevant for last-minute revision]\n\n## 💡 UPSC Exam Patterns\n[How this chapter is typically asked: Prelims MCQ pattern, Mains essay angles, common question types]\n\nBe STRICT about relevance. Only include what appears in actual UPSC exams. Skip general educational content.`;

    try {
      const result = await callAI(prompt, 3000);
      res.json({ overview: result.text, subject, chapter, class: cls, provider: result.provider });
    } catch (aiErr) {
      console.error('AI call failed for overview:', aiErr.message);
      const prebuiltData = chapterOverviews[chapter];
      if (prebuiltData) {
        res.json({ overview: prebuiltData.overview, subject, chapter, class: cls, provider: 'Prebuilt' });
      } else {
        const fallback = `## 📖 Chapter Overview\n${chapter} is a crucial chapter in ${subject} for Class ${cls}. It covers important historical, geographical, or political concepts relevant to UPSC preparation.\n\n## 🎯 UPSC Key Topics\n- Key events and personalities\n- Important dates and timelines\n- Social and political structures\n- Economic systems\n- Cultural developments\n\n## 📚 Critical Concepts for UPSC\nThis chapter contains fundamental concepts that frequently appear in UPSC Prelims and Mains exams. Students should focus on understanding the interconnections between different topics.\n\n## 🔑 Important Facts & Dates\nVarious important facts and dates are covered in this chapter that are essential for UPSC preparation.\n\n## 🗺️ UPSC Connection Map\nThis chapter connects to multiple GS papers and is relevant for both Prelims MCQs and Mains essays.\n\n## ⚡ Quick Revision — 10 One-Liners\n1. Key concept 1\n2. Key concept 2\n3. Key concept 3\n4. Key concept 4\n5. Key concept 5\n6. Key concept 6\n7. Key concept 7\n8. Key concept 8\n9. Key concept 9\n10. Key concept 10\n\n## 💡 UPSC Exam Patterns\nThis chapter is typically asked in Prelims as MCQs and in Mains as essay questions.`;
        res.json({ overview: fallback, subject, chapter, class: cls, provider: 'Fallback' });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/pyqs', protect, async (req, res) => {
  try {
    const { subject, chapter, class: cls } = req.body;
    
    const specificContent = chapterContent[chapter];
    if (specificContent && specificContent.pyqs && specificContent.pyqs.length > 0) {
      return res.json({ pyqs: specificContent.pyqs, subject, chapter, class: cls, provider: 'Chapter-Specific PYQs', count: specificContent.pyqs.length });
    }
    
    const pyqs = getRandomPYQs(chapter, 20);
    if (pyqs.length > 0) {
      return res.json({ pyqs, subject, chapter, class: cls, provider: 'PYQ Bank' });
    }

    const prompt = `You are a UPSC PYQ expert. Generate ALL important Previous Year Questions (PYQs) that have been asked from NCERT ${subject} Class ${cls} chapter "${chapter}" in UPSC Prelims and Mains exams from 1979 to 2024.\n\nReturn ONLY a JSON array in this exact format:\n[\n  {\n    "year": 2019,\n    "exam": "UPSC Prelims",\n    "paper": "GS Paper 1",\n    "question": "Full question text here",\n    "options": ["A) option1", "B) option2", "C) option3", "D) option4"],\n    "correctAnswer": "A) option1",\n    "explanation": "Detailed explanation of why this answer is correct and what concept it tests",\n    "difficulty": "easy/medium/hard",\n    "topic": "specific topic within the chapter"\n  }\n]\n\nInclude:\n- UPSC Prelims MCQs (with options)\n- UPSC Mains questions (options array will be empty [], correctAnswer will be "Subjective")\n- State PSC questions if highly relevant\n- Questions from 1979 to 2024\n\nGenerate at least 15-20 questions. If fewer actual PYQs exist, add highly probable exam questions based on the chapter's importance. Mark those with year: 0 and exam: "Expected Question".\n\nReturn ONLY the JSON array, no other text.`;

    try {
      const result = await callAI(prompt, 3000);
      const jsonMatch = result.text.match(/\[\s*\{[\s\S]*?\}\s*\]/);
      const aiPyqs = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      res.json({ pyqs: aiPyqs, subject, chapter, class: cls, provider: result.provider });
    } catch (aiErr) {
      console.error('AI call failed for PYQs:', aiErr.message);
      const fallbackPyqs = getRandomPYQs(chapter, 20);
      res.json({ pyqs: fallbackPyqs, subject, chapter, class: cls, provider: 'Fallback' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/summary', protect, async (req, res) => {
  try {
    const { subject, chapter, class: cls } = req.body;
    const prompt = `Create a concise NCERT study summary for:\nSubject: ${subject} | Class: ${cls} | Chapter: "${chapter}"\n\n## Overview\n## Key Concepts\n## Important Facts\n## UPSC Connection\n## Quick Revision (5 points)\n\nKeep it crisp and exam-focused.`;
    const result = await callAI(prompt, 1500);
    res.json({ summary: result.text, subject, chapter, class: cls, provider: result.provider });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/youtube-videos', protect, async (req, res) => {
  try {
    const { subject, chapter, class: cls } = req.body;
    
    const specificContent = chapterContent[chapter];
    if (specificContent && specificContent.videos) {
      return res.json({ videos: specificContent.videos, subject, chapter, class: cls, provider: 'Chapter-Specific', note: 'Curated videos for this chapter' });
    }
    
    const videos = [
      {
        title: `${chapter} - Complete Explanation`,
        channel: 'BYJU\'S',
        duration: '15:45',
        url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(`${subject} ${chapter} class ${cls} NCERT`),
        description: 'Search for comprehensive explanation of the chapter with examples and key concepts',
        quality: 'excellent'
      },
      {
        title: `${chapter} - Quick Revision`,
        channel: 'Vedantu',
        duration: '8:20',
        url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(`${chapter} revision class ${cls}`),
        description: 'Search for quick revision of key concepts and important facts',
        quality: 'good'
      },
      {
        title: `${chapter} - Detailed Study`,
        channel: 'Khan Academy',
        duration: '12:15',
        url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(`${subject} ${chapter} tutorial`),
        description: 'Search for detailed study material with examples',
        quality: 'excellent'
      },
      {
        title: `${chapter} - UPSC Preparation`,
        channel: 'Crash Course',
        duration: '10:30',
        url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(`${chapter} UPSC preparation`),
        description: 'Search for UPSC-focused content on this chapter',
        quality: 'good'
      }
    ];
    
    res.json({ videos, subject, chapter, class: cls, provider: 'YouTube Search', note: 'Click to search YouTube for relevant videos' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/download/:subject/:class/:chapter', protect, (req, res) => {
  try {
    const { subject, class: cls, chapter } = req.params;
    
    const downloadLink = {
      official: 'https://ncert.nic.in/textbook.php',
      message: `Download NCERT ${subject} Class ${cls} from official NCERT website`,
      chapter: chapter,
      subject: subject,
      class: cls,
      instructions: 'Visit the NCERT website to download the complete textbook PDF'
    };
    
    res.json(downloadLink);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
