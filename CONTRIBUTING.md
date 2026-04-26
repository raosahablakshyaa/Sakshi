# Contributing to Sakshi's Mentor

Thank you for your interest in contributing to Sakshi's Mentor! This document provides guidelines and instructions for contributing.

---

## 🎯 How to Contribute

### 1. Fork the Repository
Click the "Fork" button on GitHub to create your own copy of the repository.

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/sakshi-mentor.git
cd sakshi-mentor
```

### 3. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-scenario-questions`
- `fix/interview-analysis-bug`
- `docs/update-readme`

### 4. Make Your Changes
- Follow the existing code style
- Write clear, commented code
- Test your changes locally

### 5. Commit Your Changes
```bash
git add .
git commit -m "Brief description of changes"
```

Use clear commit messages:
- ✅ `Add scenario-based interview questions`
- ✅ `Fix: Correct class-wise question filtering`
- ❌ `update stuff`
- ❌ `fix bug`

### 6. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request
- Go to the original repository
- Click "New Pull Request"
- Select your branch
- Add a clear description of your changes
- Submit the PR

---

## 📋 Code Style Guidelines

### JavaScript/TypeScript
- Use 2-space indentation
- Use `const` by default, `let` when needed
- Use arrow functions `() => {}`
- Add JSDoc comments for functions

```javascript
/**
 * Fetches user data from the API
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} User data
 */
const fetchUser = async (userId) => {
  // Implementation
};
```

### React Components
- Use functional components with hooks
- Use descriptive component names
- Keep components focused and reusable

```typescript
interface Props {
  title: string;
  onClick: () => void;
}

export default function Button({ title, onClick }: Props) {
  return <button onClick={onClick}>{title}</button>;
}
```

### CSS/Tailwind
- Use Tailwind classes
- Follow mobile-first approach
- Use consistent spacing and colors

---

## 🧪 Testing

Before submitting a PR:

1. **Test locally**
   ```bash
   npm run dev
   ```

2. **Check for errors**
   - No console errors
   - No TypeScript errors
   - Responsive design works

3. **Test the feature**
   - Verify new functionality works
   - Test edge cases
   - Check on different browsers

---

## 📝 Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, etc.

### Examples
```
feat: Add scenario-based interview questions

- Added 4 new scenario questions
- Implemented score extraction
- Added comprehensive analysis endpoint

Closes #123
```

---

## 🚫 What NOT to Commit

- `.env` files (API keys, secrets)
- `node_modules/` directory
- `.next/` or `build/` directories
- IDE configuration files
- OS-specific files (`.DS_Store`, `Thumbs.db`)
- Temporary or log files

These are already in `.gitignore`, but double-check before committing.

---

## 🐛 Reporting Bugs

When reporting bugs, include:

1. **Description**: What is the bug?
2. **Steps to Reproduce**: How to reproduce it?
3. **Expected Behavior**: What should happen?
4. **Actual Behavior**: What actually happens?
5. **Screenshots**: If applicable
6. **Environment**: OS, browser, Node version, etc.

---

## 💡 Suggesting Features

When suggesting features:

1. **Title**: Clear, concise title
2. **Description**: Detailed description of the feature
3. **Use Case**: Why is this feature needed?
4. **Examples**: How would it be used?
5. **Related Issues**: Any related issues?

---

## 📚 Documentation

When adding new features:

1. Update `README.md` if needed
2. Add code comments for complex logic
3. Update API documentation
4. Add examples in docstrings

---

## 🔄 Pull Request Process

1. **Update your branch**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Resolve conflicts** if any

3. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Wait for review**
   - Maintainers will review your PR
   - Address any feedback
   - Make requested changes

5. **Merge**
   - Once approved, your PR will be merged
   - Your branch will be deleted

---

## 🎓 Development Setup

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `.env` files in both `backend/` and `frontend/` directories with required API keys.

---

## 📞 Questions?

- Open an issue on GitHub
- Check existing issues and discussions
- Contact maintainers

---

## 🙏 Thank You!

Thank you for contributing to Sakshi's Mentor! Your efforts help make IAS preparation accessible to everyone.

---

*Happy Contributing! 🚀*
