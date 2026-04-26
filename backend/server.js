require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Security & Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/ncert', require('./routes/ncert'));
app.use('/api/currentaffairs', require('./routes/currentAffairs'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/interview', require('./routes/interview'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/parent', require('./routes/parent'));

app.get('/health', (req, res) => res.json({ status: 'Sakshi\'s Mentor Backend Running 🚀' }));

// MongoDB + Server Start
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error('MongoDB Error:', err));
