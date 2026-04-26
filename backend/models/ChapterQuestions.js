const mongoose = require('mongoose');

const chapterQuestionsSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  class: { type: Number, required: true },
  chapterIndex: { type: Number, required: true },
  chapterTitle: { type: String, required: true },
  questions: [{
    _id: String,
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String,
    difficulty: String,
    type: { type: String, enum: ['ai', 'pyq', 'fallback'], default: 'ai' },
    topic: String,
    upscRelevance: Boolean,
    year: Number,
    exam: String
  }],
  totalQuestions: { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // 7 days
}, { timestamps: true });

chapterQuestionsSchema.index({ subject: 1, class: 1, chapterIndex: 1 }, { unique: true });
chapterQuestionsSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ChapterQuestions', chapterQuestionsSchema);
