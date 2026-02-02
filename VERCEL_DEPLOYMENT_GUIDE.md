# 🚀 Deploy Backend to Vercel (100% FREE)

## Why Vercel?
- ✅ Completely FREE for personal projects
- ✅ No credit card required
- ✅ Automatic deployments from GitHub
- ✅ Global CDN and fast performance
- ✅ Easy environment variable management

## Step-by-Step Guide:

### Step 1: Go to Vercel
1. Open [vercel.com](https://vercel.com)
2. Click **"Start Deploying"** or **"Sign Up"**
3. **Sign up with GitHub** (use the same account as your repository)

### Step 2: Import Your Project
1. After signing in, click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories
3. Find **"Y262521/Ethiopian-job-portal"** and click **"Import"**

### Step 3: Configure Project Settings (CRITICAL)
**IMPORTANT:** Before clicking Deploy, configure these settings:

**Framework Preset:** Other
**Root Directory:** `backend` (click "Edit" next to Root Directory)
**Build Command:** `npm install` (leave default)
**Output Directory:** Leave empty
**Install Command:** `npm install`

### Step 4: Add Environment Variables
Click **"Environment Variables"** and add these:

```
NODE_ENV = production
JWT_SECRET = ethiopia-job-super-secret-key-2024-production-ready
JWT_EXPIRES_IN = 24h
FRONTEND_URL = https://ethiopia-job-portal.netlify.app
DATABASE_PATH = ./database.sqlite
```

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. You'll get a URL like: `https://your-project-name.vercel.app`

### Step 6: Test Your Backend
Visit: `https://your-vercel-url.vercel.app/api/health`

Should show: `{"status": "OK", "message": "Ethiopia Job Portal API is running"}`

## Important Notes:

### Database Considerations
- Vercel is serverless, so SQLite files are read-only in production
- For a fully functional app, you might need to use a cloud database
- For testing purposes, the current setup will work with limited functionality

### File Uploads
- Uploaded files (CVs) won't persist on Vercel's serverless environment
- For production, consider using cloud storage (AWS S3, Cloudinary, etc.)

## Next Steps After Backend Deployment:

1. **Copy your Vercel URL**
2. **Update `.env.production`** with your Vercel URL
3. **Deploy frontend to Netlify**
4. **Update Vercel's FRONTEND_URL** environment variable with Netlify URL

## Alternative: Full-Stack Vercel Deployment

You can also deploy both frontend and backend together on Vercel:

1. **Root Directory:** Leave empty (deploy from root)
2. **Framework:** React
3. **Add API routes** in `/api` folder
4. **Single deployment** for both frontend and backend

## Cost: $0.00 Forever! 🎉

Vercel's free tier includes:
- Unlimited personal projects
- 100GB bandwidth/month
- Automatic HTTPS
- Global CDN
- No time limits

## Troubleshooting:

### If deployment fails:
1. Check build logs in Vercel dashboard
2. Verify `backend/vercel.json` exists
3. Ensure `backend/package.json` has correct dependencies

### If API doesn't work:
1. Check environment variables are set
2. Verify the API URL format
3. Check CORS settings match your frontend URL