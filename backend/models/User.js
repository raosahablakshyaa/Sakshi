const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
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
  
  // Personalization & Learning Profile
  learningSpeed: { type: String, enum: ['slow', 'medium', 'fast'], default: 'medium' },
  learningStyle: { type: String, enum: ['visual', 'textual', 'interactive', 'mixed'], default: 'mixed' },
  preferredLanguage: { type: String, default: 'hinglish' },
  
  // Subject Performance Tracking
  subjectPerformance: [{
    subject: String,
    accuracy: { type: Number, default: 0 },
    questionsAttempted: { type: Number, default: 0 },
    lastAttemptDate: Date,
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' }
  }],
  
  // Learning Preferences
  preferredTopics: [String],
  avoidedTopics: [String],
  conceptsToReview: [String],
  
  // Mentor Memory
  mentorNotes: { type: String, default: '' },
  personalityTraits: [String],
  motivationFactors: [String],
  
  // Study Patterns
  averageStudyDuration: { type: Number, default: 0 },
  peakStudyHours: [String],
  consistencyScore: { type: Number, default: 0 },
  
  // Mastered Questions (correct answers - won't repeat)
  masteredQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  
  // Chapter-wise mastered questions tracking
  chapterMastered: [{
    subject: String,
    class: Number,
    chapter: String,
    masteredQuestionIds: [String],
    masteredAt: { type: Date, default: Date.now }
  }],
  
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

userSchema.methods.getPersonalizationContext = function() {
  return {
    name: this.name,
    class: this.currentClass,
    learningSpeed: this.learningSpeed,
    learningStyle: this.learningStyle,
    strongSubjects: this.strongSubjects,
    weakSubjects: this.weakSubjects,
    accuracy: this.totalCorrect > 0 ? Math.round((this.totalCorrect / this.totalQuestionsAttempted) * 100) : 0,
    streak: this.streak,
    mentorNotes: this.mentorNotes,
    personalityTraits: this.personalityTraits,
    motivationFactors: this.motivationFactors,
    subjectPerformance: this.subjectPerformance
  };
};

module.exports = mongoose.model('User', userSchema);
