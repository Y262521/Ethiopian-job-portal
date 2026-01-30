# Quick Deployment Guide

## 🚀 Deploy in 15 Minutes

### Step 1: Prepare for Deployment
```bash
npm run deploy:prep
```
This will:
- Create environment files
- Build your React app
- Run basic checks

### Step 2: Deploy Backend (Railway - Free)

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Create New Project** → "Deploy from GitHub repo"
4. **Select your repository**
5. **Choose `backend` folder as root**
6. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=ethiopia-job-portal-super-secret-key-2024
   FRONTEND_URL=https://your-app.netlify.app
   ```
7. **Deploy** (takes 2-3 minutes)
8. **Copy your Railway URL** (e.g., `https://your-app.railway.app`)

### Step 3: Deploy Frontend (Netlify - Free)

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up with GitHub**
3. **New site from Git** → Choose your repository
4. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `build`
5. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   ```
   (Use the Railway URL from Step 2)
6. **Deploy** (takes 3-5 minutes)
7. **Copy your Netlify URL** (e.g., `https://your-app.netlify.app`)

### Step 4: Update CORS Settings

1. **Go back to Railway dashboard**
2. **Update FRONTEND_URL environment variable**:
   ```
   FRONTEND_URL=https://your-app.netlify.app
   ```
   (Use the Netlify URL from Step 3)
3. **Redeploy backend** (Railway will auto-redeploy)

### Step 5: Test Your Deployment

Visit your Netlify URL and test:
- ✅ Homepage loads
- ✅ Login/Signup works
- ✅ Job listings display
- ✅ Admin functions work

## 🎉 You're Live!

Your Ethiopia Job Portal is now deployed and accessible worldwide!

### Your URLs:
- **Frontend**: https://your-app.netlify.app
- **Backend API**: https://your-backend.railway.app
- **Admin Login**: admin@ethiopiajob.com / admin123456

### Free Tier Limits:
- **Netlify**: 100GB bandwidth/month
- **Railway**: $5 credit/month (enough for small apps)

### Need Help?
- Check `DEPLOYMENT_GUIDE.md` for detailed instructions
- Common issues and solutions included
- Scaling and production tips

## Optional: Custom Domain

### Add Your Own Domain (e.g., ethiopiajob.com)

1. **Buy domain** from any registrar
2. **In Netlify**: Domain settings → Add custom domain
3. **Update DNS** with your registrar:
   - Add CNAME record pointing to your Netlify URL
4. **SSL Certificate** will be automatically generated

Total time: 5 minutes after DNS propagation (up to 24 hours)

## Cost Breakdown

### Free Tier (Perfect for testing):
- **Total**: $0/month
- **Bandwidth**: 100GB/month
- **Build minutes**: 300/month
- **Users**: Unlimited

### Paid Tier (For production):
- **Netlify Pro**: $19/month
- **Railway**: $5-20/month
- **Total**: $24-39/month
- **Custom domain**: $10-15/year

## Security Notes

✅ **HTTPS**: Automatic with Netlify/Railway  
✅ **Environment Variables**: Secure and encrypted  
✅ **Rate Limiting**: Already configured  
✅ **CORS**: Properly configured  
✅ **JWT Authentication**: Secure tokens  

Your app is production-ready and secure!