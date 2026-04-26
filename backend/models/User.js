const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  role: { type: String, enum: ['student', 'parent', 'admin'], default: 'student' },
  avatar: { type: String, default: '' },
  currentClass: { type: Number, default: 7, min: 6, max: 12 },
  targetYear: { type: Number, default: 2035 },
  parentEmail: { type: String },
  googleId: { type: String },
  isActive: { type: Boolean, default: true },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  totalQuestionsAttempted: { type: Number, default: 0 },
  totalCorrect: { type: Number, default: 0 },
  badges: [{ name: String, earnedAt: Date, icon: String }],
  weakSubjects: [String],
  strongSubjects: [String],
  studyGoalMinutes: { type: Number, default: 120 },
  notifications: { type: Boolean, default: true },
  theme: { type: String, default: 'dark' },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.updateStreak = function() {
  const today = new Date().toDateString();
  const lastActive = new Date(this.lastActiveDate).toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (lastActive === today) return;
  if (lastActive === yesterday) this.streak += 1;
  else this.streak = 1;
  this.lastActiveDate = new Date();
};

module.exports = mongoose.model('User', userSchema);
