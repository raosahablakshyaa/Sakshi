# 🎓 Sakshi's Mentor — Your Personal IAS Mentor 24/7

> *"I don't need expensive coaching. I have Sakshi's Mentor."*

A full-stack AI-powered UPSC/IAS preparation platform built for Sakshi — a Class 7 student with the dream of becoming an IAS officer.

---

## 🚀 What's Built

| Feature | Status |
|---|---|
| AI Mentor (Gemini + Groq fallback) | ✅ |
| NCERT Hub (Class 6–12, 5 subjects) | ✅ |
| Chapter-Specific PYQs & Videos | ✅ |
| Daily Practice MCQ Engine (50 questions/subject) | ✅ |
| Answer Submission + Explanation | ✅ |
| AI Mock Interview (16 questions + Scenarios) | ✅ |
| Interview Analysis & Feedback | ✅ |
| Voice Input (Browser Speech API) | ✅ |
| Current Affairs + Auto Quiz | ✅ |
| Progress Dashboard + Charts | ✅ |
| Streak + Badge System | ✅ |
| Parent Dashboard | ✅ |
| Admin Panel + Leaderboard | ✅ |
| JWT Auth (Register/Login) | ✅ |
| Premium Dark UI | ✅ |
| External Study Resources (ClearIAS) | ✅ |

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
│   ├── middleware/      # JWT auth + admin guard
│   ├── lib/             # aiUtils, chapterContent, chapterData, pyqBank
│   └── server.js
├── frontend/
│   ├── app/
│   │   ├── (auth)/      # login, register
│   │   ├── (dashboard)/ # dashboard, mentor, ncert, practice, interview, current-affairs, parent, admin, important-dates
│   │   └── page.tsx     # Landing page
│   ├── components/      # Sidebar, UI components
│   ├── context/         # AuthContext
│   ├── lib/             # API utility (axios)
│   └── types/           # TypeScript types
├── .gitignore           # Git ignore rules
├── .gitattributes       # Line ending rules
└── README.md            # This file
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
- Chapter-specific PYQs (1979-2024)
- YouTube video recommendations per chapter
- External study resources (ClearIAS links)
- UPSC relevance connection for every chapter

### Daily Practice
- 50 questions per subject (25 AI + 25 PYQ)
- Class-wise questions based on student's level
- Subject + difficulty filters
- Instant answer explanation
- Session accuracy tracking
- Progress saved to dashboard

### Mock Interview
- 16 UPSC-style personality test questions
- 4 scenario-based questions (real-world dilemmas)
- AI evaluates each answer with scores (Content / Communication / Confidence)
- Voice answer input supported
- Comprehensive analysis at the end
- Detailed feedback on strengths and areas for improvement

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

## 📤 GitHub Setup & Push Instructions

### Initial Setup (First Time)

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Sakshi's Mentor - AI-powered IAS preparation platform"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/sakshi-mentor.git

# Push to GitHub
git push -u origin main
```

### Regular Updates

```bash
# Check status
git status

# Add changes
git add .

# Commit with meaningful message
git commit -m "Feature: Add scenario-based interview questions"

# Push to GitHub
git push origin main
```

### Important Notes

- **`.gitignore` file** is already configured to exclude:
  - `node_modules/` (dependencies)
  - `.env` files (API keys and secrets)
  - `.next/` and `build/` (build artifacts)
  - `.DS_Store` and `Thumbs.db` (OS files)
  - IDE files (`.vscode/`, `.idea/`)
  - Logs and temporary files

- **`.gitattributes` file** ensures consistent line endings across Windows, Mac, and Linux

- **Never commit**:
  - API keys or credentials
  - `.env` files
  - `node_modules/` directory
  - Build artifacts
  - IDE configuration files

### Troubleshooting

**If you accidentally committed `.env` file:**

```bash
# Remove from git history
git rm --cached .env

# Add to .gitignore
echo ".env" >> .gitignore

# Commit the change
git commit -m "Remove .env file from tracking"

# Push
git push origin main
```

**If you get "fatal: not a git repository":**

```bash
# Initialize git in the project root
git init
git remote add origin https://github.com/YOUR_USERNAME/sakshi-mentor.git
```

**If you get "permission denied" error:**

```bash
# Make sure you have SSH key set up or use HTTPS
# For HTTPS, use: git remote set-url origin https://github.com/YOUR_USERNAME/sakshi-mentor.git
```

---

## 🎯 First Steps After Setup

1. Register as admin: After registering, manually update your user's `role` to `"admin"` in MongoDB
2. Go to `/admin` → click "Add Sample Questions" to seed starter questions
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
- [ ] Offline mode support
- [ ] Multi-language support

---

## 📝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🤝 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the maintainers.

---

*Built with ❤️ for Sakshi's IAS Dream 🇮🇳*
