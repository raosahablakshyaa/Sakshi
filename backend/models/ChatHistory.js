const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
  subject: { type: String },
  topic: { type: String },
  isBookmarked: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
