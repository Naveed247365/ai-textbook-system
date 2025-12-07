# GitHub Repository Setup Instructions

## Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository with name: `ai-textbook-system` (or your preferred name)
3. **Do NOT** check "Initialize this repository with a README"
4. **Do NOT** select .gitignore or license (we already have these)
5. Click "Create repository"

## Step 2: Add Remote and Push
After creating the repository on GitHub, run these commands:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/ai-textbook-system.git

# Verify the remote is added
git remote -v

# Push the current branch
git push -u origin 1-full-system-spec
```

## Step 3: GitHub Authentication (if needed)
If you encounter authentication issues, you have two options:

### Option A: HTTPS with Personal Access Token (Recommended)
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Fine-grained personal access tokens" or "Classic personal access tokens"
3. Give it a name and select appropriate scopes (at minimum: repo, workflow)
4. Copy the generated token
5. When prompted for username/password, use:
   - Username: Your GitHub username
   - Password: The personal access token you just created

### Option B: SSH (Alternative)
1. Generate SSH key:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
2. Add to ssh-agent:
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```
3. Copy SSH key to clipboard:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
4. Add SSH key to GitHub: https://github.com/settings/keys
5. Change remote URL to SSH:
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/ai-textbook-system.git
   ```

## Step 4: Verify Successful Push
After pushing, verify everything was pushed correctly:
```bash
git status
git log --oneline -5
```

Your complete Physical AI & Humanoid Robotics Textbook System will then be available on GitHub!