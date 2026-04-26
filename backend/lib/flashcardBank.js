// Real UPSC-focused flashcards for NCERT chapters
const flashcardBank = {
  'The Delhi Sultans': [
    {
      front: 'What is The Delhi Sultans?',
      back: 'The Delhi Sultanate (1206-1526) was an Islamic empire that ruled North India for over 300 years. It was established after Muhammad of Ghor defeated Prithviraj Chauhan in 1192. The sultanate had five major dynasties: Slave, Khalji, Tughlaq, Sayyid, and Lodi. It introduced Persian administrative systems, Indo-Islamic architecture, and new military technologies to India.',
      difficulty: 'easy'
    },
    {
      front: 'Who was Qutb-ud-Din Aibak?',
      back: 'Qutb-ud-Din Aibak (1206-1210) was the founder of the Slave Dynasty and the first Sultan of Delhi. He was originally a slave of Muhammad of Ghor but became independent after his master\'s death. He established the Slave Dynasty and started the construction of the Qutb Minar. He is known as the "founder of Muslim rule in India".',
      difficulty: 'medium'
    },
    {
      front: 'What was the Iqta system?',
      back: 'The Iqta system was a land revenue and military system used by the Delhi Sultanate. Iqtadars (military officers) were given land grants (iqtas) in exchange for military service. They collected taxes from the land and maintained soldiers. This system was similar to feudalism and helped the sultanate maintain a standing army without a large central treasury.',
      difficulty: 'medium'
    },
    {
      front: 'What is the Qutb Minar?',
      back: 'The Qutb Minar is a 73-meter high minaret built in Delhi. Construction was started by Qutb-ud-Din Aibak in 1193 and completed by his successor Iltutmish. It is the tallest minaret in the world and is a UNESCO World Heritage Site. It represents the beginning of Indo-Islamic architecture in India and is decorated with intricate carvings and calligraphy.',
      difficulty: 'easy'
    },
    {
      front: 'Who was Muhammad bin Tughlaq?',
      back: 'Muhammad bin Tughlaq (1325-1351) was the most famous Tughlaq sultan known for his experimental policies. He introduced token currency (1330-1332), shifted the capital from Delhi to Daulatabad, and expanded the sultanate to South India. His policies were often unsuccessful and led to economic crisis. He is remembered as an intellectual but impractical ruler.',
      difficulty: 'hard'
    },
    {
      front: 'What was the token currency experiment?',
      back: 'Muhammad bin Tughlaq introduced token currency (brass and copper coins) in place of silver coins (1330-1332). This was an early attempt at fiat currency to control inflation and prevent hoarding of silver. However, the experiment failed because people counterfeited the tokens, leading to economic chaos. It was abandoned after two years.',
      difficulty: 'hard'
    },
    {
      front: 'Who was Alauddin Khalji?',
      back: 'Alauddin Khalji (1296-1316) was the most powerful Khalji sultan who expanded the sultanate to its greatest extent. He conquered Gujarat, Malwa, Rajasthan, and parts of South India. He introduced market reforms (price controls) and military reforms. He built the Alai Darwaza, the first Indo-Islamic structure to use the true arch. He is known for his administrative efficiency.',
      difficulty: 'medium'
    },
    {
      front: 'What was the Alai Darwaza?',
      back: 'The Alai Darwaza (1311 CE) was built by Alauddin Khalji as a gate to the Quwwat-ul-Islam Mosque. It is architecturally significant as the first Indo-Islamic structure to use the true arch instead of corbelled arches. This innovation influenced later Mughal architecture. It is decorated with intricate marble inlay work and calligraphy.',
      difficulty: 'hard'
    },
    {
      front: 'Who was Iltutmish?',
      back: 'Iltutmish (1211-1236) was the third and most successful Slave Dynasty sultan. He consolidated the sultanate, completed the Qutb Minar, and expanded the empire. He introduced the Iqta system more systematically and established the Madrasa (Islamic school). He is known for his administrative reforms and military conquests. He was the first sultan to be recognized by the Caliph.',
      difficulty: 'medium'
    },
    {
      front: 'What was the significance of 1206 CE?',
      back: '1206 CE marks the establishment of the Delhi Sultanate when Qutb-ud-Din Aibak declared independence after Muhammad of Ghor\'s death. This year is significant as it marks the beginning of Islamic rule in North India and the end of Hindu kingdoms\' dominance. The Delhi Sultanate ruled for 320 years until it was replaced by the Mughal Empire in 1526.',
      difficulty: 'hard'
    }
  ],
  'The Mughal Empire': [
    {
      front: 'What is The Mughal Empire?',
      back: 'The Mughal Empire (1526-1857) was an Islamic empire that ruled most of the Indian subcontinent. It was founded by Babur after his victory at the Battle of Panipat (1526). The empire reached its greatest extent under Akbar and Aurangzeb. It is known for its administrative system, Indo-Islamic architecture (Taj Mahal), and cultural synthesis of Hindu and Islamic traditions.',
      difficulty: 'easy'
    },
    {
      front: 'Who was Babur?',
      back: 'Babur (1483-1530) was the founder of the Mughal Empire. He was a Central Asian warrior who invaded India and defeated Ibrahim Lodi at the Battle of Panipat (1526). He established the Mughal Empire and ruled for 4 years. He is known for his military tactics, use of artillery, and patronage of arts. He wrote his autobiography "Baburnama".',
      difficulty: 'medium'
    },
    {
      front: 'What was the Battle of Panipat (1526)?',
      back: 'The Battle of Panipat (1526) was fought between Babur and Ibrahim Lodi, the last Sultan of Delhi. Babur\'s superior military tactics and use of artillery defeated Ibrahim Lodi\'s larger army. This victory established the Mughal Empire and marked the end of the Delhi Sultanate. It is considered one of the most important battles in Indian history.',
      difficulty: 'medium'
    },
    {
      front: 'Who was Akbar?',
      back: 'Akbar (1556-1605) was the greatest Mughal emperor who expanded the empire to its greatest extent. He introduced the Mansabdari system, abolished the jizya tax, and promoted religious tolerance through "Sulh-i-Kul" (universal peace). He patronized arts, literature, and architecture. He appointed people of merit regardless of religion. He is known as the "architect of the Mughal Empire".',
      difficulty: 'medium'
    },
    {
      front: 'What was the Mansabdari system?',
      back: 'The Mansabdari system was a military ranking and administrative system introduced by Akbar. Mansabdars were military officers given ranks (mansabs) from 10 to 5000. They were paid salaries in cash or through jagirs (land grants). This system ensured loyalty, prevented rebellion, and created a professional military. It was based on merit rather than birth.',
      difficulty: 'hard'
    },
    {
      front: 'What was "Sulh-i-Kul"?',
      back: '"Sulh-i-Kul" (universal peace) was Akbar\'s policy of religious tolerance and communal harmony. He abolished the jizya (tax on non-Muslims), appointed Hindus to high positions, and promoted Hindu-Muslim unity. He married Hindu princesses and participated in Hindu festivals. This policy helped integrate Hindu and Muslim communities and strengthened the empire.',
      difficulty: 'hard'
    },
    {
      front: 'Who built the Taj Mahal?',
      back: 'Shah Jahan (1628-1658) built the Taj Mahal as a mausoleum for his wife Mumtaz Mahal who died in 1631. Construction took 22 years (1632-1653) and involved 20,000 workers. It is considered the greatest example of Indo-Islamic architecture. It is made of white marble with intricate inlay work. It was designated a UNESCO World Heritage Site in 1972.',
      difficulty: 'easy'
    },
    {
      front: 'What was Fatehpur Sikri?',
      back: 'Fatehpur Sikri was a city built by Akbar near Agra (1571-1585) as the capital of the Mughal Empire. It was built to honor the Sufi saint Salim Chishti. The city contains the Buland Darwaza (Gate of Magnificence), palaces, mosques, and administrative buildings. Akbar abandoned it after 14 years due to water scarcity. It is now a UNESCO World Heritage Site.',
      difficulty: 'medium'
    },
    {
      front: 'Who was Aurangzeb?',
      back: 'Aurangzeb (1658-1707) was the last great Mughal emperor. He expanded the empire to its greatest territorial extent but his policies led to its decline. He imposed the jizya tax on non-Muslims, destroyed Hindu temples, and pursued orthodox Islamic policies. His policies alienated Hindu subjects and led to rebellions. After his death, the empire rapidly declined.',
      difficulty: 'medium'
    },
    {
      front: 'What was the Red Fort?',
      back: 'The Red Fort (Lal Qila) was built by Shah Jahan in Delhi (1638-1648) as the main residence of the Mughal emperors. It is made of red sandstone and contains palaces, mosques, gardens, and administrative buildings. It served as the seat of Mughal power for over 200 years. It is now a UNESCO World Heritage Site and a symbol of Indian independence.',
      difficulty: 'easy'
    }
  ],
  'Rulers and Buildings': [
    {
      front: 'What is Rulers and Buildings?',
      back: 'This chapter covers the relationship between rulers and their architectural patronage in medieval India. It focuses on how rulers used architecture to display power, promote religion, and leave a legacy. Key topics include the Qutb Minar, Taj Mahal, Red Fort, Fatehpur Sikri, and other Indo-Islamic structures. It shows how architecture reflects the political and cultural values of different dynasties.',
      difficulty: 'easy'
    },
    {
      front: 'What is Indo-Islamic architecture?',
      back: 'Indo-Islamic architecture is a blend of Islamic and Indian architectural styles that developed during the Delhi Sultanate and Mughal Empire. It combines Islamic elements (arches, domes, minarets, calligraphy) with Indian elements (corbelled arches, decorative patterns, gardens). Key features include the use of marble, intricate inlay work, and geometric designs. Examples: Qutb Minar, Taj Mahal, Red Fort.',
      difficulty: 'medium'
    },
    {
      front: 'What was the Buland Darwaza?',
      back: 'The Buland Darwaza (Gate of Magnificence) was built by Akbar in Fatehpur Sikri (1575) to commemorate his victory in Gujarat. It is 54 meters high and is one of the highest gates in the world. It is decorated with intricate carvings and calligraphy. It represents Akbar\'s military power and architectural ambition. It is now a UNESCO World Heritage Site.',
      difficulty: 'medium'
    },
    {
      front: 'What is the Alai Darwaza?',
      back: 'The Alai Darwaza (1311 CE) was built by Alauddin Khalji as a gate to the Quwwat-ul-Islam Mosque in Delhi. It is architecturally significant as the first Indo-Islamic structure to use the true arch. This innovation influenced later Mughal architecture. It is decorated with marble inlay work and Arabic calligraphy. It represents the evolution of Indo-Islamic architecture.',
      difficulty: 'hard'
    },
    {
      front: 'What was the significance of the Qutb Minar?',
      back: 'The Qutb Minar (1193-1368) is a 73-meter high minaret in Delhi built by successive sultans. It represents the beginning of Indo-Islamic architecture in India. It is decorated with intricate carvings and calligraphy. It served as a minaret for the Quwwat-ul-Islam Mosque. It is a UNESCO World Heritage Site and symbolizes the establishment of Islamic rule in India.',
      difficulty: 'medium'
    },
    {
      front: 'What was the purpose of Mughal gardens?',
      back: 'Mughal gardens were designed as symbols of paradise on earth, reflecting Islamic concepts of heaven. They featured symmetrical layouts, water channels, fountains, and flowering plants. Famous examples: Taj Mahal gardens, Red Fort gardens, Lodi Gardens. Gardens served both aesthetic and practical purposes - they provided cooling, recreation, and displayed the ruler\'s wealth and power.',
      difficulty: 'medium'
    },
    {
      front: 'What is the Jama Masjid?',
      back: 'The Jama Masjid in Delhi was built by Shah Jahan (1644-1658). It is one of the largest mosques in India with a capacity of 25,000 worshippers. It is made of red sandstone and white marble. It has three gates, four minarets, and a large courtyard. It represents the architectural grandeur of the Mughal Empire and is still an important place of worship.',
      difficulty: 'medium'
    },
    {
      front: 'What was the Lodi Gardens?',
      back: 'The Lodi Gardens in Delhi were built by Sikandar Lodi (1489-1517) of the Lodi dynasty. They contain tombs of Lodi rulers and are designed in the Mughal garden style. The gardens feature symmetrical layouts, water channels, and flowering plants. They are now a public park in Delhi and represent the architectural style of the late Delhi Sultanate.',
      difficulty: 'easy'
    },
    {
      front: 'What is the Humayun\'s Tomb?',
      back: 'Humayun\'s Tomb in Delhi was built by his first wife Haji Begum (1565-1572). It is the first garden-tomb in Indo-Islamic architecture and inspired the design of the Taj Mahal. It is made of red sandstone with marble inlay work. It is a UNESCO World Heritage Site. It represents the evolution of Mughal architecture and the role of women in patronizing arts.',
      difficulty: 'hard'
    }
  ],
  'Towns, Traders and Craftspersons': [
    {
      front: 'What is Towns, Traders and Craftspersons?',
      back: 'This chapter covers the economic and social life in medieval India, focusing on urban centers, trade networks, and craft guilds. It discusses how towns developed around trade routes, temples, and administrative centers. It covers the role of merchants, craftspersons, and guilds in the economy. It shows how medieval Indian economy was interconnected with Central Asian and maritime trade.',
      difficulty: 'easy'
    },
    {
      front: 'What were medieval Indian towns?',
      back: 'Medieval Indian towns developed around trade routes, temples, and administrative centers. Major towns included Delhi, Agra, Surat, Calicut, and Cambay. Towns had bazaars, caravanserais (rest houses), temples, mosques, and administrative buildings. They were centers of commerce, crafts, and culture. Towns attracted merchants, craftspersons, and laborers from different regions.',
      difficulty: 'medium'
    },
    {
      front: 'What was the guild system (Shreni)?',
      back: 'The guild system (Shreni) was an organization of craftspersons and merchants in medieval India. Guilds controlled the quality of goods, prices, and training of apprentices. They protected the interests of their members and maintained standards. Guilds were hierarchical with masters, journeymen, and apprentices. They played an important role in regulating the economy and maintaining social order.',
      difficulty: 'medium'
    },
    {
      front: 'What were the major trade routes?',
      back: 'Medieval India had two major trade routes: the Silk Road (overland) and maritime routes. The Silk Road connected India with Central Asia, Persia, and China. Maritime routes connected Indian ports (Surat, Calicut, Cambay) with Arab, Persian, and Southeast Asian ports. Trade included spices, textiles, metals, and luxury goods. Trade enriched merchants and rulers.',
      difficulty: 'medium'
    },
    {
      front: 'What was the role of merchants?',
      back: 'Merchants were important in medieval Indian economy. They organized trade networks, financed expeditions, and established trading posts. They formed merchant guilds for mutual protection and regulation. Merchants accumulated wealth and often became bankers and moneylenders. They influenced political decisions and were patronized by rulers. They facilitated cultural exchange between regions.',
      difficulty: 'medium'
    },
    {
      front: 'What were major medieval Indian ports?',
      back: 'Major medieval Indian ports included Surat, Calicut, Cambay, Cochin, and Goa. These ports were centers of maritime trade with Arab, Persian, and European merchants. They exported spices, textiles, and luxury goods. They imported horses, metals, and luxury items. Ports were controlled by local rulers who collected taxes. They were cosmopolitan centers with diverse populations.',
      difficulty: 'medium'
    },
    {
      front: 'What were the main exports from medieval India?',
      back: 'Main exports from medieval India included spices (pepper, cloves, nutmeg), textiles (cotton, silk), metals (iron, copper), gems, and luxury goods. Spices were the most valuable export and were in high demand in Europe and the Middle East. Textiles from Bengal and Gujarat were famous. These exports generated wealth for merchants and rulers.',
      difficulty: 'easy'
    },
    {
      front: 'What was the role of craftspersons?',
      back: 'Craftspersons (weavers, metalworkers, potters, jewelers) were important in medieval Indian economy. They produced goods for local consumption and export. They organized into guilds for mutual protection and regulation. They trained apprentices and maintained quality standards. They were patronized by rulers and merchants. Their skills were highly valued and passed down through generations.',
      difficulty: 'medium'
    },
    {
      front: 'What was the caravanserai?',
      back: 'A caravanserai was a rest house for merchants and traders traveling on trade routes. It provided accommodation, food, and security for merchants and their goods. Caravanserais were built by rulers and wealthy merchants. They were located at regular intervals on trade routes. They facilitated long-distance trade by providing safe places to rest and trade goods.',
      difficulty: 'hard'
    }
  ]
};

function getFlashcardsForChapter(chapter) {
  return flashcardBank[chapter] || [];
}

module.exports = {
  flashcardBank,
  getFlashcardsForChapter
};
