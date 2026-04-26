# 📋 GitHub Push Checklist

Before pushing your code to GitHub, verify all items below:

---

## ✅ Pre-Push Verification

### 1. Environment & Secrets
- [ ] `.env` file is NOT staged for commit
- [ ] No API keys in any committed files
- [ ] No passwords or credentials in code
- [ ] `.env` is in `.gitignore`

### 2. Dependencies
- [ ] `node_modules/` is NOT staged
- [ ] `package-lock.json` or `yarn.lock` is committed (optional)
- [ ] All dependencies are listed in `package.json`

### 3. Build Artifacts
- [ ] `.next/` directory is NOT staged
- [ ] `build/` directory is NOT staged
- [ ] `dist/` directory is NOT staged
- [ ] `out/` directory is NOT staged

### 4. IDE & OS Files
- [ ] `.vscode/` is NOT staged
- [ ] `.idea/` is NOT staged
- [ ] `.DS_Store` is NOT staged
- [ ] `Thumbs.db` is NOT staged

### 5. Logs & Temporary Files
- [ ] `*.log` files are NOT staged
- [ ] `tmp/` directory is NOT staged
- [ ] `temp/` directory is NOT staged

### 6. Code Quality
- [ ] No console.log() statements left (except for debugging)
- [ ] No commented-out code blocks
- [ ] No TODO comments without context
- [ ] Code follows project style guide

### 7. Testing
- [ ] Code tested locally
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Responsive design verified

### 8. Documentation
- [ ] README.md updated if needed
- [ ] Code comments added for complex logic
- [ ] Function documentation added
- [ ] API changes documented

### 9. Git Status
- [ ] `git status` shows only intended changes
- [ ] No untracked files that should be committed
- [ ] No staged files that shouldn't be committed

### 10. Commit Message
- [ ] Commit message is clear and descriptive
- [ ] Commit message follows format: `type: description`
- [ ] Commit message is not too long (< 72 characters)

---

## 🚀 Push Commands

### First Time Setup
```bash
# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Sakshi's Mentor - AI-powered IAS preparation platform"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/sakshi-mentor.git

# Push
git push -u origin main
```

### Regular Updates
```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "feat: Add new feature"

# Push
git push origin main
```

---

## 🔍 Verification Commands

### Check what will be committed
```bash
git status
```

### See staged changes
```bash
git diff --staged
```

### See unstaged changes
```bash
git diff
```

### Check for large files
```bash
git ls-files -l | sort -k5 -rh | head -20
```

### Check for sensitive files
```bash
git grep -i "password\|api_key\|secret" -- '*.js' '*.ts' '*.json'
```

---

## ⚠️ Common Issues & Solutions

### Issue: `.env` file was committed
```bash
# Remove from git history
git rm --cached .env

# Add to .gitignore
echo ".env" >> .gitignore

# Commit
git commit -m "Remove .env file from tracking"

# Push
git push origin main
```

### Issue: `node_modules/` was committed
```bash
# Remove from git
git rm -r --cached node_modules/

# Add to .gitignore (should already be there)
echo "node_modules/" >> .gitignore

# Commit
git commit -m "Remove node_modules from tracking"

# Push
git push origin main
```

### Issue: Large files committed
```bash
# Check file sizes
git ls-files -l | sort -k5 -rh | head -10

# Remove large files
git rm --cached large-file.zip

# Commit
git commit -m "Remove large file"

# Push
git push origin main
```

### Issue: Wrong branch
```bash
# Check current branch
git branch

# Switch to correct branch
git checkout main

# Push
git push origin main
```

---

## 📊 File Size Guidelines

- **Total repo size**: < 100 MB (ideal)
- **Single file**: < 10 MB
- **node_modules**: Should NOT be committed
- **Build artifacts**: Should NOT be committed

---

## 🔐 Security Checklist

- [ ] No hardcoded API keys
- [ ] No hardcoded passwords
- [ ] No database credentials
- [ ] No JWT secrets
- [ ] No private keys
- [ ] No access tokens
- [ ] No sensitive user data

---

## 📝 Commit Message Examples

### Good Examples
```
feat: Add scenario-based interview questions
fix: Correct class-wise question filtering
docs: Update README with GitHub instructions
refactor: Simplify interview analysis logic
perf: Optimize database queries
```

### Bad Examples
```
update
fix bug
changes
stuff
wip
```

---

## 🎯 Final Checklist Before Push

```bash
# 1. Check status
git status

# 2. Verify no sensitive files
git diff --staged | grep -i "password\|api_key\|secret"

# 3. Check file sizes
git ls-files -l | sort -k5 -rh | head -5

# 4. Verify .gitignore
cat .gitignore | grep -E "node_modules|\.env|\.next"

# 5. Push
git push origin main
```

---

## ✨ After Successful Push

- [ ] Verify on GitHub website
- [ ] Check commit history
- [ ] Verify all files are present
- [ ] Verify no sensitive files are visible
- [ ] Update project documentation if needed

---

## 📞 Need Help?

- Check `.gitignore` file
- Review `.gitattributes` file
- Read `CONTRIBUTING.md`
- Check `README.md`
- Open an issue on GitHub

---

*Happy pushing! 🚀*
