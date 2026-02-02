# 🚀 Quick Deploy to Render (5 Minutes)

## Why Switch to Render?
- ✅ Perfect for Express.js apps
- ✅ 100% FREE (750 hours/month)
- ✅ No serverless complications
- ✅ Traditional server deployment
- ✅ No credit card required

## Step-by-Step (Super Easy):

### Step 1: Go to Render
1. Open [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. **Sign up with GitHub** (same account)

### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. **Connect GitHub** and select: **"Y262521/Ethiopian-job-portal"**
3. Click **"Connect"**

### Step 3: Configure (IMPORTANT)
**Name:** `ethiopia-job-portal-backend`
**Root Directory:** `backend`
**Environment:** `Node`
**Build Command:** `npm install`
**Start Command:** `npm start`
**Instance Type:** `Free`

### Step 4: Environment Variables
Add these in the Environment section:
```
NODE_ENV=production
JWT_SECRET=ethiopia-job-super-secret-key-2024-production-ready
JWT_EXPIRES_IN=24h
FRONTEND_URL=https://ethiopia-job-portal.netlify.app
DATABASE_PATH=./database.sqlite
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 3-5 minutes
3. Get your URL: `https://your-app-name.onrender.com`

## Test Your API
Visit: `https://your-render-url.onrender.com/api/health`

Should show: `{"status": "OK", "message": "Ethiopia Job Portal API is running"}`

## Why This Will Work:
- Render runs your Express server normally
- No serverless complications
- SQLite database works perfectly
- File uploads work
- Traditional deployment

## Next Steps:
1. Copy your Render URL
2. Update frontend environment
3. Deploy frontend to Netlify
4. Update CORS settings

Ready to try Render? It's much simpler for Express apps!