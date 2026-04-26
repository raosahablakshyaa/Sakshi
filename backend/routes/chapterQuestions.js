const express = require('express');
const router = express.Router();
const ChapterQuestions = require('../models/ChapterQuestions');
const { protect } = require('../middleware/auth');
const { callAI } = require('../lib/aiUtils');

// Detailed chapter prompts for AI to generate specific questions
const CHAPTER_PROMPTS = {
  history: {
    7: {
      1: `Generate 50 multiple choice questions about "Tracing Changes Through a Thousand Years" (Class 7 History Chapter 1).
Topics: How historians study the past, periodization, sources of history, dating methods, historical evidence, understanding time periods.
Questions should cover: What is history, primary sources, secondary sources, periodization, carbon dating, inscriptions, manuscripts, archaeological evidence.
Return JSON array with 50 questions.`,
      
      2: `Generate 50 multiple choice questions about "New Kings and Kingdoms" (Class 7 History Chapter 2).
Topics: Rajput kingdoms, Deccan sultanates, regional powers 1000-1500 CE, political structures, feudalism.
Questions should cover: Who were Rajputs, Rajput kingdoms (Mewar, Marwar), Deccan kingdoms, Bahmani Sultanate, feudal system, regional rulers.
Return JSON array with 50 questions.`,
      
      3: `Generate 50 multiple choice questions about "The Delhi Sultans" (Class 7 History Chapter 3).
Topics: Delhi Sultanate, Slave Dynasty, Tughlaq Dynasty, Lodi Dynasty, sultanate administration, military system.
Questions should cover: Muhammad of Ghor, Qutb-ud-din Aibak, Slave Dynasty, Alauddin Khilji, Muhammad bin Tughlaq, Firoz Shah, sultanate government, revenue system.
Return JSON array with 50 questions.`,
      
      4: `Generate 50 multiple choice questions about "The Mughal Empire" (Class 7 History Chapter 4).
Topics: Mughal emperors, Akbar, Jahangir, Shah Jahan, Aurangzeb, Mughal administration, revenue system, military organization.
Questions should cover: Babur, Humayun, Akbar's reforms, Akbar's religious policy, Jahangir, Shah Jahan, Aurangzeb, Mansabdari system, Mughal culture.
Return JSON array with 50 questions.`,
      
      5: `Generate 50 multiple choice questions about "Rulers and Buildings" (Class 7 History Chapter 5).
Topics: Mughal architecture, Taj Mahal, mosques, temples, palaces, urban planning, architectural styles, monuments.
Questions should cover: Taj Mahal, Red Fort, Jama Masjid, Mughal gardens, Indo-Islamic architecture, Shah Jahan, architectural features, monuments and their builders.
Return JSON array with 50 questions.`,
      
      6: `Generate 50 multiple choice questions about "Towns, Traders and Craftspersons" (Class 7 History Chapter 6).
Topics: Trade routes, merchant communities, guilds, urban centers, commerce networks, craft production, economic systems.
Questions should cover: Silk Road, trade routes, merchants, guilds, urban centers, crafts, textile industry, metalwork, trade networks, market towns.
Return JSON array with 50 questions.`,
      
      7: `Generate 50 multiple choice questions about "Tribes, Nomads and Settled Communities" (Class 7 History Chapter 7).
Topics: Tribal societies, nomadic pastoral groups, settlement patterns, social structures, tribal economies, interactions.
Questions should cover: Tribal communities, nomadic groups, pastoral societies, tribal social structure, tribal economy, interactions with settled communities, tribal culture.
Return JSON array with 50 questions.`,
      
      8: `Generate 50 multiple choice questions about "Devotional Paths to the Divine" (Class 7 History Chapter 8).
Topics: Bhakti movement, Sufi traditions, religious reformers, saints and teachings, devotional practices, spiritual movements.
Questions should cover: Bhakti movement, Kabir, Mirabai, Sufism, Sufi saints, religious tolerance, devotional practices, spiritual experiences, religious reforms.
Return JSON array with 50 questions.`,
      
      9: `Generate 50 multiple choice questions about "The Making of Regional Cultures" (Class 7 History Chapter 9).
Topics: Regional kingdoms, local cultures, regional literature and art, cultural diversity, regional identities, cultural contributions.
Questions should cover: Regional kingdoms, Vijayanagara Empire, regional art forms, regional literature, regional rulers, cultural diversity, regional contributions to Indian culture.
Return JSON array with 50 questions.`,
      
      10: `Generate 50 multiple choice questions about "Eighteenth-Century Political Formations" (Class 7 History Chapter 10).
Topics: Maratha Empire, regional states, political fragmentation, European arrival, power struggles, transition to colonial period.
Questions should cover: Maratha Empire, Shivaji, Maratha expansion, regional states, Mughal decline, European arrival, British East India Company, political changes.
Return JSON array with 50 questions.`
    },
    8: {
      1: `Generate 50 multiple choice questions about "How, When and Where" (Class 8 History Chapter 1).
Topics: Historical sources, archaeological methods, dating techniques, historical periods, geographical context.
Questions should cover: Primary sources, secondary sources, archaeological evidence, dating methods, historical periods, geographical context of history.
Return JSON array with 50 questions.`,
      
      2: `Generate 50 multiple choice questions about "From Trade to Territory" (Class 8 History Chapter 2).
Topics: East India Company, British expansion, trade monopoly, territorial conquest, colonial policies.
Questions should cover: East India Company formation, British expansion in India, trade monopoly, territorial conquest, colonial administration, British policies.
Return JSON array with 50 questions.`,
      
      3: `Generate 50 multiple choice questions about "Ruling the Countryside" (Class 8 History Chapter 3).
Topics: Zamindari system, revenue collection, land revenue policies, peasant relations, rural administration.
Questions should cover: Zamindari system, revenue collection methods, land revenue, peasant relations, rural administration, agrarian economy, colonial policies.
Return JSON array with 50 questions.`,
      
      4: `Generate 50 multiple choice questions about "Tribals, Dikus and the Vision of a Golden Age" (Class 8 History Chapter 4).
Topics: Tribal revolts, Santhal rebellion, tribal resistance, colonial exploitation, tribal aspirations.
Questions should cover: Tribal revolts, Santhal rebellion, tribal resistance movements, colonial exploitation of tribals, tribal leaders, tribal aspirations.
Return JSON array with 50 questions.`,
      
      5: `Generate 50 multiple choice questions about "When People Rebel" (Class 8 History Chapter 5).
Topics: 1857 Revolt, Sepoy Mutiny, causes of rebellion, rebel leaders, colonial response, impact.
Questions should cover: 1857 Revolt, Sepoy Mutiny, causes of rebellion, rebel leaders, colonial response, impact of the revolt, aftermath.
Return JSON array with 50 questions.`,
      
      6: `Generate 50 multiple choice questions about "Weavers, Iron Smelters and Factory Owners" (Class 8 History Chapter 6).
Topics: Textile industry changes, industrial revolution impact, factory system, artisan decline, economic transformation.
Questions should cover: Textile industry, industrial revolution, factory system, artisan decline, economic changes, British policies, Indian crafts.
Return JSON array with 50 questions.`,
      
      7: `Generate 50 multiple choice questions about "Civilising the Native, Educating the Nation" (Class 8 History Chapter 7).
Topics: Colonial education policies, English education, Indian education systems, cultural imperialism, educational reforms.
Questions should cover: Colonial education policies, English education introduction, Indian education, cultural imperialism, educational reforms, Macaulay's Minute.
Return JSON array with 50 questions.`,
      
      8: `Generate 50 multiple choice questions about "Women, Caste and Reform" (Class 8 History Chapter 8).
Topics: Women status, caste system, social reform movements, reformers, gender and caste discrimination.
Questions should cover: Women status in society, caste system issues, social reform movements, reformers and their ideas, gender discrimination, caste discrimination.
Return JSON array with 50 questions.`,
      
      9: `Generate 50 multiple choice questions about "The Making of the National Movement" (Class 8 History Chapter 9).
Topics: Indian nationalism, Congress formation, nationalist leaders, independence struggle, political movements.
Questions should cover: Indian nationalism emergence, Congress formation, nationalist leaders, independence struggle phases, political movements, nationalist ideas.
Return JSON array with 50 questions.`,
      
      10: `Generate 50 multiple choice questions about "India After Independence" (Class 8 History Chapter 10).
Topics: Partition, independence, constitution, nation building, post-colonial development.
Questions should cover: Partition of India, independence achievement, constitution making, nation building challenges, post-colonial development, Nehru's vision.
Return JSON array with 50 questions.`
    }
  },
  geography: {
    7: {
      1: `Generate 50 multiple choice questions about "Environment" (Class 7 Geography Chapter 1).
Topics: Ecosystem, biotic and abiotic components, food chains, environmental balance, human-environment relationships.
Questions should cover: Ecosystem definition, biotic components, abiotic components, food chains, food webs, environmental balance, human impact.
Return JSON array with 50 questions.`,
      
      2: `Generate 50 multiple choice questions about "Inside Our Earth" (Class 7 Geography Chapter 2).
Topics: Earth structure, crust, mantle, core, layers, mineral composition.
Questions should cover: Earth layers, crust composition, mantle characteristics, core properties, minerals, rocks, earth structure.
Return JSON array with 50 questions.`,
      
      3: `Generate 50 multiple choice questions about "Our Changing Earth" (Class 7 Geography Chapter 3).
Topics: Weathering, erosion, plate tectonics, earthquakes, volcanoes, landform changes.
Questions should cover: Weathering processes, erosion, plate tectonics, earthquakes, volcanoes, landform changes, geological processes.
Return JSON array with 50 questions.`,
      
      4: `Generate 50 multiple choice questions about "Air" (Class 7 Geography Chapter 4).
Topics: Atmosphere, air pressure, wind, air pollution, atmospheric layers.
Questions should cover: Atmosphere composition, air pressure, wind patterns, air pollution, atmospheric layers, weather systems.
Return JSON array with 50 questions.`,
      
      5: `Generate 50 multiple choice questions about "Water" (Class 7 Geography Chapter 5).
Topics: Water cycle, oceans, rivers, groundwater, water resources, water pollution.
Questions should cover: Water cycle, oceans, rivers, groundwater, water resources, water pollution, water conservation.
Return JSON array with 50 questions.`,
      
      6: `Generate 50 multiple choice questions about "Natural Vegetation and Wildlife" (Class 7 Geography Chapter 6).
Topics: Forests, grasslands, deserts, wildlife, biodiversity, vegetation zones.
Questions should cover: Forest types, grassland ecosystems, desert environments, wildlife habitats, biodiversity, vegetation zones, conservation.
Return JSON array with 50 questions.`,
      
      7: `Generate 50 multiple choice questions about "Human Environment – Settlement, Transport and Communication" (Class 7 Geography Chapter 7).
Topics: Settlement types, transportation, communication, urban development, infrastructure.
Questions should cover: Settlement types, transportation systems, communication networks, urban development, infrastructure, human settlements.
Return JSON array with 50 questions.`,
      
      8: `Generate 50 multiple choice questions about "Human-Environment Interactions" (Class 7 Geography Chapter 8).
Topics: Resource use, environmental impact, sustainable development, conservation, human activities.
Questions should cover: Resource utilization, environmental impact, sustainable development, conservation efforts, human activities, environmental protection.
Return JSON array with 50 questions.`,
      
      9: `Generate 50 multiple choice questions about "Life in the Temperate Grasslands" (Class 7 Geography Chapter 9).
Topics: Grassland climate, vegetation, animals, peoples, economic activities.
Questions should cover: Grassland climate, vegetation types, animal adaptations, grassland peoples, economic activities, lifestyle.
Return JSON array with 50 questions.`,
      
      10: `Generate 50 multiple choice questions about "Life in the Deserts" (Class 7 Geography Chapter 10).
Topics: Desert climate, vegetation, animals, peoples, adaptation strategies.
Questions should cover: Desert climate, desert vegetation, desert animals, desert peoples, adaptation strategies, lifestyle, economic activities.
Return JSON array with 50 questions.`
    }
  },
  polity: {
    7: {
      1: `Generate 50 multiple choice questions about "On Equality" (Class 7 Political Science Chapter 1).
Topics: Equality concept, discrimination, equal rights, social equality, gender equality.
Questions should cover: Concept of equality, discrimination types, equal rights, social equality, gender equality, caste equality, constitutional rights.
Return JSON array with 50 questions.`,
      
      2: `Generate 50 multiple choice questions about "Role of the Government in Health" (Class 7 Political Science Chapter 2).
Topics: Healthcare systems, public health programs, government services, health policies, health rights.
Questions should cover: Healthcare systems, public health programs, government health services, health policies, health rights, health infrastructure.
Return JSON array with 50 questions.`,
      
      3: `Generate 50 multiple choice questions about "How the State Government Works" (Class 7 Political Science Chapter 3).
Topics: State government structure, state assembly, chief minister, state administration, state functions.
Questions should cover: State government structure, state assembly, chief minister role, state administration, state functions, state legislature.
Return JSON array with 50 questions.`,
      
      4: `Generate 50 multiple choice questions about "Growing up as Boys and Girls" (Class 7 Political Science Chapter 4).
Topics: Gender roles, gender stereotypes, gender equality, socialization, gender discrimination.
Questions should cover: Gender roles, gender stereotypes, gender equality, gender socialization, gender discrimination, gender issues.
Return JSON array with 50 questions.`,
      
      5: `Generate 50 multiple choice questions about "Women Change the World" (Class 7 Political Science Chapter 5).
Topics: Women movements, women leaders, women rights, gender activism, women contributions.
Questions should cover: Women movements, women leaders, women rights struggles, gender activism, women contributions, women empowerment.
Return JSON array with 50 questions.`,
      
      6: `Generate 50 multiple choice questions about "Understanding Media" (Class 7 Political Science Chapter 6).
Topics: Media types, media role, journalism, media influence, media literacy.
Questions should cover: Media types, media role in society, journalism, media influence, media literacy, responsible media, freedom of press.
Return JSON array with 50 questions.`,
      
      7: `Generate 50 multiple choice questions about "Understanding Advertising" (Class 7 Political Science Chapter 7).
Topics: Advertising types, consumer awareness, advertising ethics, marketing, consumer rights.
Questions should cover: Advertising types, consumer awareness, advertising ethics, marketing strategies, consumer rights, consumer protection.
Return JSON array with 50 questions.`,
      
      8: `Generate 50 multiple choice questions about "Markets Around Us" (Class 7 Political Science Chapter 8).
Topics: Market types, trade systems, commerce, market economy, consumer behavior.
Questions should cover: Market types, trade systems, commerce, market economy, consumer behavior, market dynamics, economic systems.
Return JSON array with 50 questions.`,
      
      9: `Generate 50 multiple choice questions about "A Shirt in the Market" (Class 7 Political Science Chapter 9).
Topics: Production process, supply chain, market dynamics, pricing, economic systems.
Questions should cover: Production process, supply chain, market dynamics, pricing mechanisms, economic systems, production and distribution.
Return JSON array with 50 questions.`
    }
  }
};

// Generate questions using AI
async function generateChapterQuestions(subject, classNum, chapterIndex, chapterTitle) {
  const prompt = CHAPTER_PROMPTS[subject]?.[classNum]?.[chapterIndex];
  
  if (!prompt) {
    throw new Error(`No prompt found for ${subject} Class ${classNum} Chapter ${chapterIndex}`);
  }

  const fullPrompt = `${prompt}

Format: Return ONLY a valid JSON array with exactly this structure for each question:
[
  {
    "question": "Question text here?",
    "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
    "correctAnswer": "A) First option",
    "explanation": "Explanation of the correct answer",
    "difficulty": "easy"
  }
]

IMPORTANT:
- Return ONLY the JSON array, no other text
- Each question must have exactly 4 options
- Difficulty should be: easy, medium, or hard
- Make sure all 50 questions are unique and different
- No markdown, no code blocks, just pure JSON`;

  try {
    const result = await callAI(fullPrompt, 8000);
    
    // Extract JSON from response
    let jsonText = result.text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.includes('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    jsonText = jsonText.trim();
    
    // Parse JSON
    const questions = JSON.parse(jsonText);
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid response format');
    }

    // Validate and map questions
    const validQuestions = questions.filter(q => 
      q.question && q.options && Array.isArray(q.options) && q.options.length === 4 && 
      q.correctAnswer && q.explanation
    ).map((q, idx) => ({
      _id: `ai-${subject}-${classNum}-${chapterIndex}-${Date.now()}-${idx}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty || 'medium',
      topic: chapterTitle,
      type: 'ai',
      upscRelevance: true
    }));

    if (validQuestions.length === 0) {
      throw new Error('No valid questions generated');
    }

    return validQuestions;
  } catch (err) {
    console.error('Error generating questions:', err.message);
    throw new Error(`Failed to generate questions: ${err.message}`);
  }
}

// Get chapter questions
router.get('/chapter/:subject/:class/:chapterIndex/:chapterTitle', protect, async (req, res) => {
  try {
    const { subject, class: classNum, chapterIndex, chapterTitle } = req.params;
    const decodedTitle = decodeURIComponent(chapterTitle);

    // Check cache
    let cached = await ChapterQuestions.findOne({
      subject, class: parseInt(classNum), chapterIndex: parseInt(chapterIndex)
    });

    if (cached && cached.expiresAt > new Date() && cached.questions.length > 0) {
      console.log(`✅ Returning cached questions for ${decodedTitle}`);
      return res.json({
        questions: cached.questions,
        subject, class: parseInt(classNum), chapterIndex: parseInt(chapterIndex),
        chapterTitle: decodedTitle, cached: true, totalQuestions: cached.totalQuestions
      });
    }

    console.log(`🔄 Generating new questions for ${decodedTitle}...`);
    const questions = await generateChapterQuestions(subject, parseInt(classNum), parseInt(chapterIndex), decodedTitle);

    // Save to cache
    if (cached) {
      cached.questions = questions;
      cached.totalQuestions = questions.length;
      cached.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await cached.save();
    } else {
      await ChapterQuestions.create({
        subject, class: parseInt(classNum), chapterIndex: parseInt(chapterIndex),
        chapterTitle: decodedTitle, questions, totalQuestions: questions.length
      });
    }

    console.log(`✅ Generated ${questions.length} questions for ${decodedTitle}`);
    res.json({
      questions, subject, class: parseInt(classNum), chapterIndex: parseInt(chapterIndex),
      chapterTitle: decodedTitle, cached: false, totalQuestions: questions.length
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
