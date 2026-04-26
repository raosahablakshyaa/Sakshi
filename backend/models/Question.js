const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  class: { type: Number }, // null = UPSC level
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  type: { type: String, enum: ['mcq', 'subjective', 'true_false', 'fill_blank'], default: 'mcq' },
  question: { type: String, required: true },
  options: [String],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true },
  upscRelevance: { type: Boolean, default: false },
  tags: [String],
  year: { type: Number }, // PYQ year
  isActive: { type: Boolean, default: true },
  attemptCount: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
