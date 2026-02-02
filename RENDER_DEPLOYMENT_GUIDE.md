# 🚀 Deploy Backend to Render (100% FREE)

## Why Render?
- ✅ Completely FREE (750 hours/month)
- ✅ No credit card required
- ✅ Easy setup
- ✅ Automatic deployments from GitHub

## Step-by-Step Guide:

### Step 1: Go to Render
1. Open [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with your GitHub account

### Step 2: Create Web Service
1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub repository: **"Y262521/Ethiopian-job-portal"**

### Step 3: Configure Service (IMPORTANT)
**Root Directory:** `backend`
**Build Command:** `npm install`
**Start Command:** `npm start`
**Environment:** `Node`

### Step 4: Add Environment Variables
```
NODE_ENV=production
PORT=10000
JWT_SECRET=ethiopia-job-super-secret-key-2024-production-ready
JWT_EXPIRES_IN=24h
FRONTEND_URL=https://ethiopia-job-portal.netlify.app
DATABASE_PATH=./database.sqlite
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Get your URL: `https://your-app-name.onrender.com`

## Test Your Backend
Visit: `https://your-render-url.onrender.com/api/health`

Should show: `{"status": "OK", "message": "Ethiopia Job Portal API is running"}`

## Next Steps
1. Copy your Render URL
2. Update `.env.production` with Render URL
3. Deploy frontend to Netlify
4. Update Render's FRONTEND_URL with Netlify URL

## Cost: $0.00 Forever! 🎉