# Deployment Guide

Complete guide to deploy your Portfolio Backend API to various platforms.

## Table of Contents
1. [Heroku Deployment](#heroku-deployment)
2. [Railway Deployment](#railway-deployment)
3. [Render Deployment](#render-deployment)
4. [DigitalOcean App Platform](#digitalocean-app-platform)
5. [AWS EC2 Deployment](#aws-ec2-deployment)
6. [Docker Deployment](#docker-deployment)

---

## Prerequisites for All Deployments

1. **MongoDB Atlas Account** (Recommended for production)
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a cluster (Free tier available)
   - Get connection string
   - Whitelist IP: `0.0.0.0/0` (Allow from anywhere)

2. **Environment Variables Ready**
   - Have all values from `.env.example` prepared
   - Use strong passwords in production
   - Use production-grade JWT secrets

3. **GitHub Repository**
   - Push your code to GitHub
   - Make sure `.env` is in `.gitignore`

---

## 1. Heroku Deployment

### Step 1: Install Heroku CLI
```bash
# macOS
brew install heroku/brew/heroku

# Windows
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### Step 2: Login and Create App
```bash
heroku login
heroku create your-portfolio-api
```

### Step 3: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set JWT_REFRESH_SECRET="your_refresh_secret"
heroku config:set FRONTEND_URL="https://your-frontend-url.com"
heroku config:set EMAIL_HOST="smtp.gmail.com"
heroku config:set EMAIL_USER="your-email@gmail.com"
heroku config:set EMAIL_PASSWORD="your-app-password"
heroku config:set GITHUB_TOKEN="your_github_token"
```

### Step 4: Deploy
```bash
git push heroku main
```

### Step 5: Seed Database (Optional)
```bash
heroku run npm run seed
```

### Step 6: View Logs
```bash
heroku logs --tail
```

**Your API will be live at:** `https://your-portfolio-api.herokuapp.com`

---

## 2. Railway Deployment

### Step 1: Sign Up
- Go to https://railway.app
- Sign in with GitHub

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway will auto-detect Node.js

### Step 3: Add Environment Variables
1. Go to your project
2. Click "Variables"
3. Add all environment variables from `.env.example`

### Step 4: Add MongoDB (Optional - Use Railway's MongoDB)
1. Click "New"
2. Select "Database" → "Add MongoDB"
3. Copy connection string to `MONGODB_URI`

### Step 5: Deploy
- Railway auto-deploys on every push to main branch
- Get your URL from the deployment section

**Your API will be live at:** Railway-provided URL

---

## 3. Render Deployment

### Step 1: Sign Up
- Go to https://render.com
- Sign up with GitHub

### Step 2: Create Web Service
1. Click "New +"
2. Select "Web Service"
3. Connect your GitHub repository

### Step 3: Configure Service
```
Name: portfolio-backend
Environment: Node
Build Command: npm install
Start Command: node server.js
```

### Step 4: Add Environment Variables
Go to "Environment" tab and add all variables:
```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
...etc
```

### Step 5: Deploy
- Render auto-deploys on push
- Free tier: Service spins down after inactivity

**Your API will be live at:** `https://portfolio-backend-xxxx.onrender.com`

---

## 4. DigitalOcean App Platform

### Step 1: Sign Up
- Go to https://www.digitalocean.com/products/app-platform
- Create account

### Step 2: Create App
1. Click "Create App"
2. Select GitHub
3. Choose your repository
4. Select branch: `main`

### Step 3: Configure
```
Name: portfolio-backend
Environment: Node.js
Build Command: npm install
Run Command: node server.js
HTTP Port: 5000
```

### Step 4: Add Environment Variables
Add all required environment variables in the app settings

### Step 5: Choose Plan
- Basic ($5/month) or Professional
- Free tier available for static sites only

**Your API will be live at:** DigitalOcean-provided URL

---

## 5. AWS EC2 Deployment

### Step 1: Launch EC2 Instance
1. Go to AWS Console → EC2
2. Launch Instance
3. Choose Ubuntu Server 22.04 LTS
4. Instance type: t2.micro (free tier)
5. Create/Select key pair
6. Configure security group:
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere
   - HTTPS (443) - Anywhere
   - Custom TCP (5000) - Anywhere

### Step 2: Connect to Instance
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 3: Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### Step 4: Clone and Setup
```bash
# Clone repository
git clone https://github.com/vasuchauhan0/vansh-project.git
cd vansh-project/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add your environment variables
```

### Step 5: Start with PM2
```bash
pm2 start server.js --name portfolio-api
pm2 save
pm2 startup
```

### Step 6: Configure Nginx (Optional)
```bash
sudo nano /etc/nginx/sites-available/portfolio-api
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Your API will be live at:** `http://your-ec2-ip:5000` or `http://your-domain.com`

---

## 6. Docker Deployment

### Local Docker Setup
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Docker
```bash
# Build image
docker build -t portfolio-backend .

# Run container
docker run -d \
  --name portfolio-api \
  -p 5000:5000 \
  --env-file .env \
  portfolio-backend

# View logs
docker logs -f portfolio-api
```

---

## Post-Deployment Checklist

### 1. Test API Endpoints
```bash
# Health check
curl https://your-api-url.com/api/health

# Register user
curl -X POST https://your-api-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test123"}'
```

### 2. Seed Database
```bash
# Run seeder
npm run seed
```

### 3. Setup Monitoring
- Use services like:
  - New Relic
  - Datadog
  - PM2 Plus (for PM2 deployments)

### 4. Setup SSL/HTTPS
- Use Let's Encrypt for free SSL
- Most platforms auto-provide SSL

### 5. Configure CORS
- Update `FRONTEND_URL` in environment variables
- Ensure frontend can connect to backend

### 6. Setup Backups
- MongoDB Atlas auto-backup
- Or setup manual backup cron jobs

---

## Environment Variables Checklist

Make sure these are set in production:

```
✅ NODE_ENV=production
✅ PORT=5000
✅ MONGODB_URI=<atlas-connection-string>
✅ JWT_SECRET=<strong-secret>
✅ JWT_REFRESH_SECRET=<strong-secret>
✅ FRONTEND_URL=<your-frontend-url>
✅ EMAIL_USER=<gmail>
✅ EMAIL_PASSWORD=<app-password>
✅ GITHUB_TOKEN=<optional>
✅ ADMIN_EMAIL=<your-admin-email>
✅ ADMIN_PASSWORD=<strong-password>
```

---

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:** 
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure network access is configured

### Issue: CORS Errors
**Solution:**
- Update `FRONTEND_URL` in environment variables
- Check CORS configuration in `server.js`

### Issue: Email Not Sending
**Solution:**
- Verify Gmail App Password
- Check SMTP settings
- Enable "Less secure app access" (not recommended) or use App Passwords

### Issue: Port Already in Use
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

---

## Monitoring & Maintenance

### View Logs
```bash
# Heroku
heroku logs --tail

# Railway
# Use Railway dashboard

# PM2
pm2 logs

# Docker
docker logs -f container-name
```

### Database Backup
```bash
# MongoDB Atlas: Use automated backups
# Manual backup:
mongodump --uri="your_mongodb_uri" --out=/backup/folder
```

---

## Support

If you encounter issues:
1. Check logs first
2. Verify environment variables
3. Test database connection
4. Check firewall/security groups
5. Review deployment platform documentation

---

**Need Help?** Open an issue on GitHub or contact support.
