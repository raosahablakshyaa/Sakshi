const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  questionsAttempted: { type: Number, default: 0 },
  questionsCorrect: { type: Number, default: 0 },
  studyMinutes: { type: Number, default: 0 },
  subjectBreakdown: [{
    subject: String,
    attempted: Number,
    correct: Number,
  }],
  topicsRevised: [String],
  aiChatsCount: { type: Number, default: 0 },
  mockInterviewDone: { type: Boolean, default: false },
  currentAffairsRead: { type: Number, default: 0 },
  motivationScore: { type: Number, default: 0, min: 0, max: 100 },
  focusScore: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });

progressSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
