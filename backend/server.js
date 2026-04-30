require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: (origin, cb) => {
    const allowed = (process.env.FRONTEND_URL || '').split(',').map(u => u.trim());
    if (!origin || allowed.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
      cb(null, true);
    } else {
      cb(null, true); // allow all in dev; tighten in prod if needed
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// ── Health routes (no DB needed) ──────────────────────────────────────────────
app.get('/', (_req, res) => res.json({ status: "Sakshi's Mentor Backend Running 🚀", version: '1.0.0' }));
app.get('/health', (_req, res) => res.json({ ok: true }));

// ── MongoDB (cached connection for serverless) ────────────────────────────────
let dbConnected = false;

async function connectDB() {
  if (dbConnected && mongoose.connection.readyState === 1) return;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI env var is missing');
  mongoose.set('strictQuery', false);
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 8000,
  });
  dbConnected = true;
}

// DB middleware — runs before all /api routes
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err.message);
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',             require('./routes/auth'));
app.use('/api/ai',               require('./routes/ai'));
app.use('/api/questions',        require('./routes/questions'));
app.use('/api/chapter-questions',require('./routes/chapterQuestions'));
app.use('/api/ncert',            require('./routes/ncert'));
app.use('/api/currentaffairs',   require('./routes/currentAffairs'));
app.use('/api/progress',         require('./routes/progress'));
app.use('/api/interview',        require('./routes/interview'));
app.use('/api/admin',            require('./routes/admin'));
app.use('/api/parent',           require('./routes/parent'));

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Local dev server ──────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`)))
    .catch(err => { console.error('Startup error:', err); process.exit(1); });
}

module.exports = app;
