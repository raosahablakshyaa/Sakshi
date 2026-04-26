require('dotenv').config();
const mongoose = require('mongoose');
const CurrentAffairs = require('./models/CurrentAffairs');

const sampleArticles = [
  {
    title: "India Launches National AI Mission to Boost Tech Innovation",
    summary: "The Government of India announced a comprehensive National AI Mission aimed at accelerating artificial intelligence research and development across the country. The initiative will focus on creating AI infrastructure, supporting startups, and training skilled professionals. This move positions India as a global AI hub and aligns with the Digital India vision.",
    upscRelevance: "GS Paper 3 - Science & Technology, Digital India, Government initiatives for tech advancement",
    category: "science",
    source: "PIB",
    tags: ["AI", "Technology", "Innovation", "Digital India"],
    date: new Date().toISOString().split('T')[0],
    isActive: true
  },
  {
    title: "Supreme Court Upholds Right to Privacy in Digital Age",
    summary: "The Supreme Court of India delivered a landmark judgment reinforcing the fundamental right to privacy in the digital age. The court emphasized that privacy is a constitutional right and cannot be arbitrarily violated by the state or private entities. This judgment has significant implications for data protection and surveillance laws in India.",
    upscRelevance: "GS Paper 2 - Governance, Constitutional Rights, Judicial Pronouncements, Data Protection",
    category: "polity",
    source: "The Hindu",
    tags: ["Privacy", "Constitutional Rights", "Digital Rights", "Judiciary"],
    date: new Date().toISOString().split('T')[0],
    isActive: true
  },
  {
    title: "India's Green Energy Capacity Crosses 200 GW Milestone",
    summary: "India has achieved a significant milestone by crossing 200 GW of installed renewable energy capacity. This includes solar, wind, and other renewable sources. The achievement demonstrates India's commitment to its climate goals and the Paris Agreement targets. The government aims to reach 500 GW by 2030.",
    upscRelevance: "GS Paper 3 - Environment, Climate Change, Renewable Energy, Sustainable Development",
    category: "environment",
    source: "Indian Express",
    tags: ["Renewable Energy", "Climate Change", "Green Energy", "Sustainability"],
    date: new Date().toISOString().split('T')[0],
    isActive: true
  },
  {
    title: "RBI Announces New Framework for Digital Rupee (e-Rupee)",
    summary: "The Reserve Bank of India unveiled a comprehensive framework for the digital rupee (e-Rupee), India's central bank digital currency (CBDC). The e-Rupee will be issued in both wholesale and retail segments. This initiative aims to modernize India's payment system and reduce dependence on physical currency.",
    upscRelevance: "GS Paper 3 - Economy, Monetary Policy, Digital Currency, Financial Technology",
    category: "economy",
    source: "Mint",
    tags: ["Digital Rupee", "CBDC", "Monetary Policy", "FinTech"],
    date: new Date().toISOString().split('T')[0],
    isActive: true
  },
  {
    title: "India-US Strategic Partnership Strengthened with New Defense Pact",
    summary: "India and the United States signed a new defense cooperation agreement aimed at strengthening bilateral ties and enhancing military interoperability. The pact includes provisions for joint exercises, technology sharing, and defense research collaboration. This agreement reflects the deepening strategic partnership between the two nations.",
    upscRelevance: "GS Paper 2 - International Relations, Bilateral Relations, Defense Cooperation, Geopolitics",
    category: "international",
    source: "PIB",
    tags: ["India-US Relations", "Defense", "Strategic Partnership", "Geopolitics"],
    date: new Date().toISOString().split('T')[0],
    isActive: true
  },
  {
    title: "National Education Policy 2020 Shows Positive Impact on School Enrollment",
    summary: "A recent report indicates that the National Education Policy 2020 has led to increased school enrollment, particularly among girls and marginalized communities. The policy's focus on vocational training and skill development has also shown promising results. States are implementing NEP 2020 with varying degrees of success.",
    upscRelevance: "GS Paper 2 - Social Issues, Education Policy, Gender Equality, Social Development",
    category: "social",
    source: "The Hindu",
    tags: ["Education Policy", "School Enrollment", "Gender Equality", "Social Development"],
    date: new Date().toISOString().split('T')[0],
    isActive: true
  },
  {
    title: "India Ratifies International Convention on Plastic Pollution",
    summary: "India has ratified the international convention on plastic pollution, committing to reduce plastic waste and promote sustainable alternatives. The country has also launched a national campaign to eliminate single-use plastics by 2025. This move aligns with India's environmental commitments and the Sustainable Development Goals.",
    upscRelevance: "GS Paper 3 - Environment, Pollution Control, Sustainable Development, International Agreements",
    category: "environment",
    source: "Indian Express",
    tags: ["Plastic Pollution", "Environment", "Sustainability", "International Convention"],
    date: new Date().toISOString().split('T')[0],
    isActive: true
  },
  {
    title: "Government Announces New Scheme for Farmer Income Support",
    summary: "The Ministry of Agriculture announced a new scheme to provide direct income support to farmers. The scheme aims to ensure minimum income security for agricultural workers and small farmers. It includes provisions for crop insurance, market linkage, and technical support to improve agricultural productivity.",
    upscRelevance: "GS Paper 3 - Agriculture, Rural Development, Social Welfare, Government Schemes",
    category: "general",
    source: "Livemint",
    tags: ["Agriculture", "Farmer Welfare", "Income Support", "Rural Development"],
    date: new Date().toISOString().split('T')[0],
    isActive: true
  }
];

async function addSampleArticles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing articles for today
    const today = new Date().toISOString().split('T')[0];
    await CurrentAffairs.deleteMany({ date: today });
    console.log('🗑️ Cleared existing articles for today');

    // Insert sample articles
    const inserted = await CurrentAffairs.insertMany(sampleArticles);
    console.log(`✅ Added ${inserted.length} sample current affairs articles`);
    console.log('\n📰 Articles added:');
    inserted.forEach((article, i) => {
      console.log(`${i + 1}. ${article.title}`);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

addSampleArticles();
