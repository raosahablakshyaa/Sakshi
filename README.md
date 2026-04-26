# 🎓 Sakshi's Mentor — Your Personal IAS Mentor 24/7

> *"I don't need expensive coaching. I have Sakshi's Mentor."*

A full-stack AI-powered UPSC/IAS preparation platform built for Sakshi — a Class 7 student with the dream of becoming an IAS officer.

---

## 🚀 What's Built

| Feature | Status |
|---|---|
| AI Mentor (Gemini + Groq fallback) | ✅ |
| NCERT Hub (Class 6–12, 5 subjects) | ✅ |
| AI Chapter Summaries + Flashcards | ✅ |
| Daily Practice MCQ Engine | ✅ |
| Answer Submission + Explanation | ✅ |
| AI Mock Interview (15 questions) | ✅ |
| Voice Input (Browser Speech API) | ✅ |
| Current Affairs + Auto Quiz | ✅ |
| Progress Dashboard + Charts | ✅ |
| Streak + Badge System | ✅ |
| Parent Dashboard | ✅ |
| Admin Panel + Leaderboard | ✅ |
| JWT Auth (Register/Login) | ✅ |
| Premium Dark UI | ✅ |

---

## ⚙️ Setup

### 1. Backend

```bash
cd backend
npm install
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/sakshis-mentor
JWT_SECRET=your_strong_secret_here
GEMINI_API_KEY=your_gemini_api_key        # Free at aistudio.google.com
GROQ_API_KEY=your_groq_api_key            # Free at console.groq.com
NEWS_API_KEY=your_newsapi_key             # Free at newsapi.org
NODEMAILER_EMAIL=your_email@gmail.com
NODEMAILER_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
```

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:3000

---

## 🔑 Free API Keys (Zero Cost Setup)

| API | Where to Get | Cost |
|---|---|---|
| Gemini API | https://aistudio.google.com | Free (60 req/min) |
| Groq API | https://console.groq.com | Free (fast LLaMA) |
| NewsAPI | https://newsapi.org | Free (100 req/day) |
| MongoDB Atlas | https://cloud.mongodb.com | Free (512MB) |

---

## 🗂️ Project Structure

```
sakshi/
├── backend/
│   ├── models/          # User, ChatHistory, Progress, Question, CurrentAffairs
│   ├── routes/          # auth, ai, ncert, questions, currentAffairs, progress, interview, parent, admin
│   ├── middleware/       # JWT auth + admin guard
│   └── server.js
└── frontend/
    ├── app/
    │   ├── (auth)/      # login, register
    │   ├── (dashboard)/ # dashboard, mentor, ncert, practice, interview, current-affairs, parent, admin
    │   └── page.tsx     # Landing page
    ├── components/      # Sidebar
    ├── context/         # AuthContext
    ├── lib/             # API utility (axios)
    └── types/           # SpeechRecognition types
```

---

## 🌟 Key Features Explained

### AI Mentor
- Powered by Gemini 1.5 Flash (primary) + Groq LLaMA (fallback)
- Speaks in Hinglish like a real Indian teacher
- Saves chat history with session management
- Voice input via Browser Speech API (free, no API needed)
- Quick prompt suggestions for common UPSC topics

### NCERT Hub
- 5 subjects × 7 classes = 35 subject-class combinations
- AI generates chapter summaries on demand
- Flashcard system with flip animation
- UPSC relevance connection for every chapter

### Daily Practice
- Random question sets from MongoDB
- Subject + difficulty filters
- Instant answer explanation
- Session accuracy tracking
- Progress saved to dashboard

### Mock Interview
- 15 UPSC-style personality test questions
- AI evaluates each answer with scores (Content / Communication / Confidence)
- Voice answer input supported
- Marks interview session complete in progress tracker

### Current Affairs
- Fetches from NewsAPI → AI processes for UPSC relevance
- Auto-generates 3 MCQs per article
- Category tagging (polity, economy, environment, etc.)
- Cached in MongoDB to avoid repeated API calls

### Parent Dashboard
- Find child by email
- View study hours, accuracy, streak, weak subjects
- Weekly bar chart of study activity
- Guidance tips for parents

---

## 🎯 First Steps After Setup

1. Register as admin: After registering, manually update your user's `role` to `"admin"` in MongoDB
2. Go to `/admin` → click "Add Sample Questions" to seed 5 starter questions
3. Configure your API keys in `backend/.env`
4. Share the platform with Sakshi — she registers as a student!

---

## 🔮 Future Roadmap

- [ ] Firebase Google Auth
- [ ] Email reports to parents (Nodemailer)
- [ ] Razorpay premium plans
- [ ] Essay writing AI evaluator
- [ ] Mobile app (React Native)
- [ ] More question bank (500+ questions)
- [ ] PIB news integration
- [ ] AI study planner

---

*Built with ❤️ for Sakshi's IAS Dream 🇮🇳*
