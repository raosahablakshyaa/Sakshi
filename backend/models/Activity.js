const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  userClass: Number,
  activityType: { type: String, enum: ['question_solved', 'chapter_viewed', 'interview_started', 'current_affairs_read'], default: 'question_solved' },
  subject: String,
  topic: String,
  isCorrect: Boolean,
  timestamp: { type: Date, default: Date.now },
  details: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
