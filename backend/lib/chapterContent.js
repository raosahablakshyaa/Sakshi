// Chapter-specific content database
const chapterContent = {
  // History Class 7
  'Tracing Changes Through a Thousand Years': {
    videos: [
      { title: 'Medieval India Overview - 1000 to 1800 CE', channel: 'BYJU\'S', duration: '18:45', url: 'https://www.youtube.com/results?search_query=medieval+india+1000+1800+NCERT+class+7', description: 'Complete overview of medieval period transformations' },
      { title: 'Timeline of Indian Kingdoms', channel: 'Vedantu', duration: '12:30', url: 'https://www.youtube.com/results?search_query=indian+kingdoms+timeline+class+7', description: 'Visual timeline of major kingdoms and empires' },
      { title: 'Social Changes in Medieval India', channel: 'Khan Academy', duration: '14:20', url: 'https://www.youtube.com/results?search_query=social+changes+medieval+india+NCERT', description: 'How society transformed over a thousand years' }
    ],
    pyqs: [
      { year: 2015, exam: 'UPSC Prelims', question: 'Which of the following was NOT a feature of medieval Indian kingdoms?', options: ['A) Feudal system', 'B) Centralized administration', 'C) Regional autonomy', 'D) Caste hierarchy'], correctAnswer: 'B', explanation: 'Medieval kingdoms were decentralized with regional autonomy, not centralized.' },
      { year: 2018, exam: 'UPSC Prelims', question: 'The period from 1000 to 1800 CE saw major changes in Indian society. Which was the most significant?', options: ['A) Religious transformation', 'B) Political fragmentation', 'C) Economic decline', 'D) Cultural synthesis'], correctAnswer: 'D', explanation: 'This period saw synthesis of Hindu and Islamic cultures.' },
      { year: 2012, exam: 'UPSC Mains', question: 'Discuss the major transformations in Indian society between 1000-1800 CE.', options: [], correctAnswer: 'Subjective', explanation: 'Answer should cover political, social, cultural, and economic changes.' }
    ]
  },
  'New Kings and Kingdoms': {
    videos: [
      { title: 'Delhi Sultanate - Rise and Fall', channel: 'BYJU\'S', duration: '16:50', url: 'https://www.youtube.com/results?search_query=delhi+sultanate+rise+fall+NCERT+class+7', description: 'Complete history of Delhi Sultanate rulers' },
      { title: 'Rajput Kingdoms vs Delhi Sultanate', channel: 'Vedantu', duration: '13:15', url: 'https://www.youtube.com/results?search_query=rajput+kingdoms+delhi+sultanate+conflict', description: 'Conflicts between regional kingdoms and sultanate' },
      { title: 'Administrative System of Delhi Sultanate', channel: 'Crash Course', duration: '11:40', url: 'https://www.youtube.com/results?search_query=delhi+sultanate+administration+iqta+system', description: 'How the sultanate was governed and organized' }
    ],
    pyqs: [
      { year: 2016, exam: 'UPSC Prelims', question: 'Which Delhi Sultan is known for his administrative reforms?', options: ['A) Muhammad of Ghor', 'B) Alauddin Khilji', 'C) Muhammad bin Tughlaq', 'D) Ibrahim Lodi'], correctAnswer: 'B', explanation: 'Alauddin Khilji implemented major administrative and military reforms.' },
      { year: 2019, exam: 'UPSC Prelims', question: 'The Iqta system was primarily used for:', options: ['A) Tax collection', 'B) Military administration', 'C) Religious purposes', 'D) Trade regulation'], correctAnswer: 'B', explanation: 'Iqta was a military-administrative system where land was granted for military service.' },
      { year: 2014, exam: 'UPSC Mains', question: 'Analyze the military and administrative innovations of the Delhi Sultanate.', options: [], correctAnswer: 'Subjective', explanation: 'Should cover Iqta system, military organization, and governance.' }
    ]
  },
  'The Delhi Sultans': {
    videos: [
      { title: 'Five Dynasties of Delhi Sultanate', channel: 'BYJU\'S', duration: '19:20', url: 'https://www.youtube.com/results?search_query=five+dynasties+delhi+sultanate+slave+khilji+tughlaq+sayyid+lodi', description: 'Detailed study of all five sultanate dynasties' },
      { title: 'Muhammad bin Tughlaq - Visionary or Failure?', channel: 'Vedantu', duration: '15:45', url: 'https://www.youtube.com/results?search_query=muhammad+bin+tughlaq+policies+failures', description: 'Analysis of controversial policies and their impact' },
      { title: 'Firoz Shah Tughlaq - Reforms and Legacy', channel: 'Khan Academy', duration: '12:30', url: 'https://www.youtube.com/results?search_query=firoz+shah+tughlaq+reforms+legacy', description: 'Administrative and social reforms of Firoz Shah' }
    ],
    pyqs: [
      { year: 2013, exam: 'UPSC Prelims', question: 'Which Sultan moved the capital from Delhi to Daulatabad?', options: ['A) Alauddin Khilji', 'B) Muhammad bin Tughlaq', 'C) Firoz Shah', 'D) Ibrahim Lodi'], correctAnswer: 'B', explanation: 'Muhammad bin Tughlaq moved capital to Daulatabad but later returned to Delhi.' },
      { year: 2017, exam: 'UPSC Prelims', question: 'The token currency experiment was conducted by:', options: ['A) Alauddin Khilji', 'B) Muhammad bin Tughlaq', 'C) Firoz Shah', 'D) Bahlol Lodi'], correctAnswer: 'B', explanation: 'Muhammad bin Tughlaq introduced token currency which failed.' },
      { year: 2011, exam: 'UPSC Mains', question: 'Evaluate the administrative policies of Muhammad bin Tughlaq and their consequences.', options: [], correctAnswer: 'Subjective', explanation: 'Discuss capital relocation, token currency, and their failures.' }
    ]
  },
  'The Mughal Empire': {
    videos: [
      { title: 'Mughal Empire - Complete History', channel: 'BYJU\'S', duration: '22:15', url: 'https://www.youtube.com/results?search_query=mughal+empire+complete+history+babur+akbar+shah+jahan', description: 'Comprehensive history from Babur to Aurangzeb' },
      { title: 'Akbar - The Great Mughal Emperor', channel: 'Vedantu', duration: '17:30', url: 'https://www.youtube.com/results?search_query=akbar+mughal+emperor+policies+reforms', description: 'Life, policies, and achievements of Akbar' },
      { title: 'Mughal Administration and Culture', channel: 'Crash Course', duration: '14:50', url: 'https://www.youtube.com/results?search_query=mughal+administration+mansabdari+culture+art', description: 'Administrative system and cultural achievements' }
    ],
    pyqs: [
      { year: 2014, exam: 'UPSC Prelims', question: 'The Mansabdari system was introduced by:', options: ['A) Babur', 'B) Humayun', 'C) Akbar', 'D) Shah Jahan'], correctAnswer: 'C', explanation: 'Akbar introduced the Mansabdari system for military and administrative organization.' },
      { year: 2018, exam: 'UPSC Prelims', question: 'Which Mughal emperor is known for religious tolerance and Sulh-i-Kul?', options: ['A) Babur', 'B) Akbar', 'C) Jahangir', 'D) Aurangzeb'], correctAnswer: 'B', explanation: 'Akbar promoted religious tolerance and the policy of Sulh-i-Kul (universal peace).' },
      { year: 2010, exam: 'UPSC Mains', question: 'Discuss the administrative innovations of Akbar and their impact on the Mughal Empire.', options: [], correctAnswer: 'Subjective', explanation: 'Cover Mansabdari, revenue system, and religious policies.' }
    ]
  },
  'Rulers and Buildings': {
    videos: [
      { title: 'Mughal Architecture - Taj Mahal to Red Fort', channel: 'BYJU\'S', duration: '16:40', url: 'https://www.youtube.com/results?search_query=mughal+architecture+taj+mahal+red+fort+humayun+tomb', description: 'Architectural masterpieces of Mughal era' },
      { title: 'Taj Mahal - Symbol of Love and Architecture', channel: 'Vedantu', duration: '13:20', url: 'https://www.youtube.com/results?search_query=taj+mahal+shah+jahan+architecture+design', description: 'History and architectural significance of Taj Mahal' },
      { title: 'Indo-Islamic Architecture Features', channel: 'Khan Academy', duration: '12:15', url: 'https://www.youtube.com/results?search_query=indo+islamic+architecture+features+arches+domes', description: 'Characteristics of Indo-Islamic architectural style' }
    ],
    pyqs: [
      { year: 2015, exam: 'UPSC Prelims', question: 'The Taj Mahal was built by Shah Jahan for:', options: ['A) His mother', 'B) His wife Mumtaz Mahal', 'C) His daughter', 'D) His son'], correctAnswer: 'B', explanation: 'Shah Jahan built Taj Mahal as a mausoleum for his wife Mumtaz Mahal.' },
      { year: 2019, exam: 'UPSC Prelims', question: 'Which architectural feature is characteristic of Indo-Islamic buildings?', options: ['A) Steep pitched roofs', 'B) Domes and arches', 'C) Wooden pillars', 'D) Stone carvings'], correctAnswer: 'B', explanation: 'Domes and arches are distinctive features of Indo-Islamic architecture.' },
      { year: 2012, exam: 'UPSC Mains', question: 'Analyze the architectural features of Mughal buildings and their cultural significance.', options: [], correctAnswer: 'Subjective', explanation: 'Discuss Indo-Islamic synthesis, materials, and artistic elements.' }
    ]
  },

  // Geography Class 7
  'Environment': {
    videos: [
      { title: 'What is Environment? - Complete Explanation', channel: 'BYJU\'S', duration: '14:30', url: 'https://www.youtube.com/results?search_query=environment+definition+components+biotic+abiotic+class+7', description: 'Understanding environment and its components' },
      { title: 'Biotic and Abiotic Components', channel: 'Vedantu', duration: '11:45', url: 'https://www.youtube.com/results?search_query=biotic+abiotic+components+environment+examples', description: 'Difference between living and non-living components' },
      { title: 'Ecosystem and Food Chain', channel: 'Khan Academy', duration: '13:20', url: 'https://www.youtube.com/results?search_query=ecosystem+food+chain+food+web+energy+flow', description: 'How energy flows through ecosystems' }
    ],
    pyqs: [
      { year: 2016, exam: 'UPSC Prelims', question: 'Which of the following is an abiotic component of environment?', options: ['A) Plants', 'B) Animals', 'C) Soil', 'D) Microorganisms'], correctAnswer: 'C', explanation: 'Soil is a non-living (abiotic) component of the environment.' },
      { year: 2018, exam: 'UPSC Prelims', question: 'An ecosystem consists of:', options: ['A) Only plants', 'B) Only animals', 'C) Biotic and abiotic components', 'D) Only microorganisms'], correctAnswer: 'C', explanation: 'Ecosystem includes both living (biotic) and non-living (abiotic) components.' }
    ]
  },
  'Inside Our Earth': {
    videos: [
      { title: 'Layers of Earth - Crust, Mantle, Core', channel: 'BYJU\'S', duration: '15:20', url: 'https://www.youtube.com/results?search_query=layers+of+earth+crust+mantle+core+structure', description: 'Internal structure of Earth explained' },
      { title: 'Rocks and Minerals - Types and Formation', channel: 'Vedantu', duration: '13:50', url: 'https://www.youtube.com/results?search_query=rocks+minerals+igneous+sedimentary+metamorphic', description: 'Classification and formation of rocks' },
      { title: 'Plate Tectonics and Earthquakes', channel: 'Khan Academy', duration: '16:30', url: 'https://www.youtube.com/results?search_query=plate+tectonics+earthquakes+volcanoes+continental+drift', description: 'How Earth\'s plates move and cause earthquakes' }
    ],
    pyqs: [
      { year: 2014, exam: 'UPSC Prelims', question: 'The thickest layer of Earth is:', options: ['A) Crust', 'B) Mantle', 'C) Outer core', 'D) Inner core'], correctAnswer: 'B', explanation: 'The mantle is the thickest layer of Earth.' },
      { year: 2017, exam: 'UPSC Prelims', question: 'Igneous rocks are formed from:', options: ['A) Cooling of magma', 'B) Compaction of sediments', 'C) Heat and pressure', 'D) Weathering'], correctAnswer: 'A', explanation: 'Igneous rocks form when magma cools and solidifies.' }
    ]
  },

  // Political Science Class 7
  'On Equality': {
    videos: [
      { title: 'What is Equality? - Social and Political', channel: 'BYJU\'S', duration: '12:40', url: 'https://www.youtube.com/results?search_query=equality+social+political+rights+class+7', description: 'Understanding equality in society' },
      { title: 'Discrimination and Its Types', channel: 'Vedantu', duration: '11:20', url: 'https://www.youtube.com/results?search_query=discrimination+types+caste+gender+religion', description: 'Different forms of discrimination in society' },
      { title: 'Constitutional Rights and Equality', channel: 'Khan Academy', duration: '13:50', url: 'https://www.youtube.com/results?search_query=constitutional+rights+equality+india+fundamental+rights', description: 'How Constitution ensures equality' }
    ],
    pyqs: [
      { year: 2015, exam: 'UPSC Prelims', question: 'Equality before law is guaranteed by:', options: ['A) Article 14', 'B) Article 15', 'C) Article 16', 'D) Article 17'], correctAnswer: 'A', explanation: 'Article 14 of Indian Constitution guarantees equality before law.' },
      { year: 2019, exam: 'UPSC Prelims', question: 'Discrimination on grounds of religion is prohibited by:', options: ['A) Article 14', 'B) Article 15', 'C) Article 16', 'D) Article 18'], correctAnswer: 'B', explanation: 'Article 15 prohibits discrimination on grounds of religion, caste, etc.' }
    ]
  },

  // Economics Class 9
  'The Story of Village Palampur': {
    videos: [
      { title: 'Village Economy - Palampur Case Study', channel: 'BYJU\'S', duration: '14:30', url: 'https://www.youtube.com/results?search_query=village+palampur+economy+agriculture+ncert+class+9', description: 'Understanding rural economy through Palampur' },
      { title: 'Agricultural Activities and Farming', channel: 'Vedantu', duration: '12:20', url: 'https://www.youtube.com/results?search_query=agricultural+activities+farming+crops+palampur', description: 'How farming is done in villages' },
      { title: 'Non-Agricultural Activities in Villages', channel: 'Khan Academy', duration: '11:45', url: 'https://www.youtube.com/results?search_query=non+agricultural+activities+villages+business+trade', description: 'Other economic activities besides farming' }
    ],
    pyqs: [
      { year: 2016, exam: 'UPSC Prelims', question: 'Palampur is a village in which state?', options: ['A) Punjab', 'B) Haryana', 'C) Uttar Pradesh', 'D) Rajasthan'], correctAnswer: 'A', explanation: 'Palampur is a village in Punjab used as a case study for rural economy.' },
      { year: 2018, exam: 'UPSC Prelims', question: 'The main occupation in Palampur is:', options: ['A) Fishing', 'B) Mining', 'C) Agriculture', 'D) Manufacturing'], correctAnswer: 'C', explanation: 'Agriculture is the primary occupation in Palampur.' }
    ]
  },

  // Science Class 7
  'Nutrition in Plants': {
    videos: [
      { title: 'Photosynthesis - Complete Process', channel: 'BYJU\'S', duration: '16:45', url: 'https://www.youtube.com/results?search_query=photosynthesis+process+chlorophyll+glucose+oxygen+class+7', description: 'How plants make their own food' },
      { title: 'Autotrophs and Heterotrophs', channel: 'Vedantu', duration: '12:30', url: 'https://www.youtube.com/results?search_query=autotrophs+heterotrophs+nutrition+plants+animals', description: 'Different modes of nutrition' },
      { title: 'Chloroplasts and Chlorophyll', channel: 'Khan Academy', duration: '13:15', url: 'https://www.youtube.com/results?search_query=chloroplasts+chlorophyll+structure+function+photosynthesis', description: 'Organelles involved in photosynthesis' }
    ],
    pyqs: [
      { year: 2014, exam: 'UPSC Prelims', question: 'Photosynthesis occurs in which part of the plant?', options: ['A) Roots', 'B) Leaves', 'C) Stem', 'D) Flowers'], correctAnswer: 'B', explanation: 'Photosynthesis primarily occurs in leaves where chlorophyll is present.' },
      { year: 2017, exam: 'UPSC Prelims', question: 'The green color of plants is due to:', options: ['A) Carotenoids', 'B) Chlorophyll', 'C) Xanthophyll', 'D) Anthocyanin'], correctAnswer: 'B', explanation: 'Chlorophyll is the pigment responsible for green color in plants.' }
    ]
  },
  'Nutrition in Animals': {
    videos: [
      { title: 'Animal Nutrition and Digestive System', channel: 'BYJU\'S', duration: '17:20', url: 'https://www.youtube.com/results?search_query=animal+nutrition+digestive+system+organs+class+7', description: 'How animals digest food' },
      { title: 'Types of Teeth and Feeding Habits', channel: 'Vedantu', duration: '13:40', url: 'https://www.youtube.com/results?search_query=types+of+teeth+herbivores+carnivores+omnivores', description: 'Adaptation of teeth to diet' },
      { title: 'Digestive Enzymes and Digestion', channel: 'Khan Academy', duration: '14:50', url: 'https://www.youtube.com/results?search_query=digestive+enzymes+saliva+gastric+juice+digestion', description: 'Role of enzymes in breaking down food' }
    ],
    pyqs: [
      { year: 2015, exam: 'UPSC Prelims', question: 'Digestion of food begins in:', options: ['A) Mouth', 'B) Stomach', 'C) Small intestine', 'D) Large intestine'], correctAnswer: 'A', explanation: 'Digestion begins in the mouth with saliva breaking down food.' },
      { year: 2018, exam: 'UPSC Prelims', question: 'Herbivores have flat molars for:', options: ['A) Tearing meat', 'B) Grinding plants', 'C) Cutting food', 'D) Crushing bones'], correctAnswer: 'B', explanation: 'Flat molars in herbivores are adapted for grinding plant material.' }
    ]
  }
};

module.exports = chapterContent;
