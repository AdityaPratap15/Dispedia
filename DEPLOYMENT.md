# Deployment Instructions for SelfTreat

## Option 1: Render (Free - Recommended)

### Steps:
1. Push your code to GitHub
2. Go to https://render.com
3. Sign up with GitHub
4. Click "New" → "Web Service"
5. Connect your GitHub repository
6. Use these settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
   - **Plan:** Free

### Environment Variables (if needed):
- PORT: (Render sets this automatically)

---

## Option 2: Railway (Free tier)

### Steps:
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Node.js and deploys

---

## Option 3: Heroku (Paid)

### Steps:
1. Install Heroku CLI
2. Run these commands:
```bash
heroku create your-app-name
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

---

## Option 4: DigitalOcean App Platform

### Steps:
1. Go to https://cloud.digitalocean.com
2. Create App → GitHub
3. Select repository
4. Configure build settings:
   - Build Command: `npm install`
   - Run Command: `npm start`

---

## Option 5: Self-hosting on VPS

### Requirements:
- VPS with Ubuntu/Linux
- Domain name (optional)
- Basic server knowledge

### Commands for Ubuntu:
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Clone and setup your app
git clone your-repo-url
cd SelfTreat
npm install
pm2 start backend/server.js --name "selftreat"

# Setup reverse proxy with Nginx (optional)
sudo apt install nginx
# Configure Nginx to proxy port 3000
```

---

## Option 6: Local Network Access

### To make it accessible on your local network:
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update server.js to bind to all interfaces
3. Access via: `http://YOUR_LOCAL_IP:3000`

---

## Quick Start: GitHub + Render (5 minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/selftreat.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to render.com
2. Connect GitHub
3. Deploy (automatic!)

Your site will be live at: `https://your-app-name.onrender.com`