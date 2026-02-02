# 🚀 Deploy Your Ethiopia Job Portal

## Quick Deployment Steps (15 minutes)

### Step 1: Deploy Backend to Railway (FREE)

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with your GitHub account**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Important: Set root directory to `backend`**
7. **Add these Environment Variables in Railway:**
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=ethiopia-job-super-secret-key-2024-production-ready
   JWT_EXPIRES_IN=24h
   FRONTEND_URL=https://ethiopia-job-portal.netlify.app
   DATABASE_PATH=./database.sqlite
   ```
8. **Click Deploy** (takes 2-3 minutes)
9. **Copy your Railway URL** (something like: `https://backend-production-xxxx.up.railway.app`)

### Step 2: Update Frontend Environment

1. **Update `.env.production` with your Railway URL:**
   ```
   REACT_APP_API_URL=https://your-actual-railway-url.railway.app
   ```

### Step 3: Deploy Frontend to Netlify (FREE)

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up with your GitHub account**
3. **Click "New site from Git"**
4. **Choose your repository**
5. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `build`
   - Root directory: `/` (leave empty)
6. **Add Environment Variables in Netlify:**
   ```
   REACT_APP_API_URL=https://your-railway-url.railway.app
   ```
7. **Click Deploy** (takes 3-5 minutes)
8. **Copy your Netlify URL** (something like: `https://ethiopia-job-portal.netlify.app`)

### Step 4: Update Backend CORS

1. **Go back to Railway dashboard**
2. **Update the FRONTEND_URL environment variable:**
   ```
   FRONTEND_URL=https://your-actual-netlify-url.netlify.app
   ```
3. **Railway will automatically redeploy**

### Step 5: Test Your Live Website! 🎉

Visit your Netlify URL and test:
- ✅ Homepage loads
- ✅ Login/Signup works  
- ✅ Job posting works
- ✅ Applications work
- ✅ Admin panel works

### Admin Login Credentials:
- **Email:** admin@ethiopiajob.com
- **Password:** admin123456

## Your Live URLs:
- **Website:** https://your-app.netlify.app
- **API:** https://your-backend.railway.app
- **Admin Panel:** https://your-app.netlify.app/admin

## Free Tier Limits:
- **Netlify:** 100GB bandwidth/month (plenty for most sites)
- **Railway:** $5 credit/month (enough for small to medium apps)
- **Total Cost:** FREE for testing and small usage

## Need Help?

If you encounter any issues:

1. **Check Railway logs** for backend errors
2. **Check Netlify deploy logs** for frontend build errors
3. **Verify environment variables** are set correctly
4. **Test API endpoints** directly in browser

## Optional: Custom Domain

Want your own domain like `ethiopiajob.com`?

1. **Buy domain** from any registrar (GoDaddy, Namecheap, etc.)
2. **In Netlify:** Site settings → Domain management → Add custom domain
3. **Update DNS** with your registrar (Netlify will show you exactly what to do)
4. **SSL Certificate** automatically generated

## Security Features Already Included:
✅ HTTPS encryption  
✅ JWT authentication  
✅ Rate limiting  
✅ CORS protection  
✅ Input validation  
✅ SQL injection protection  

Your app is production-ready and secure!

## Troubleshooting Common Issues:

### "API not found" errors:
- Check REACT_APP_API_URL in Netlify environment variables
- Verify Railway backend is running (check Railway dashboard)

### CORS errors:
- Check FRONTEND_URL in Railway environment variables
- Make sure URLs match exactly (no trailing slashes)

### Build failures:
- Check build logs in Netlify/Railway dashboards
- Verify all dependencies are in package.json

## Scaling Up:

When you're ready for more traffic:
- **Netlify Pro:** $19/month (more bandwidth, advanced features)
- **Railway Pro:** $5-20/month (more resources, better performance)
- **Database:** Consider PostgreSQL for production (Railway offers this)

## Congratulations! 🎉

Your Ethiopia Job Portal is now live and accessible worldwide!