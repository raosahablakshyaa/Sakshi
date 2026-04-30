require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// Expose backend URL to frontend JS
app.get('/config', (req, res) => {
  res.json({ backendUrl: process.env.BACKEND_URL || 'http://localhost:8080' });
});

app.use(express.static(path.join(__dirname, 'public')));

const pages = ['dashboard', 'mentor', 'ncert', 'practice', 'interview', 'current-affairs', 'parent', 'admin', 'important-dates'];

app.get('/', (req, res) => res.redirect('/dashboard'));

pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'pages', `${page}.html`));
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Frontend running on http://localhost:${PORT}`));
