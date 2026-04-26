const mongoose = require('mongoose');

const currentAffairsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  upscRelevance: { type: String, required: true },
  category: { type: String, enum: ['polity', 'economy', 'science', 'environment', 'international', 'social', 'history', 'geography', 'general'], default: 'general' },
  source: { type: String },
  sourceUrl: { type: String },
  date: { type: String, required: true },
  tags: [String],
  isActive: { type: Boolean, default: true },
  quiz: [{
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('CurrentAffairs', currentAffairsSchema);
