# Ethiopia Job Portal - Deployment Guide

## Overview
This guide covers deploying your Ethiopia Job Portal with React frontend and Node.js backend.

## Architecture
- **Frontend**: React app (deployed on Netlify)
- **Backend**: Node.js API (deployed on Railway)
- **Database**: SQLite (for development) / PostgreSQL (for production)

## Option 1: Netlify + Railway (Recommended)

### Step 1: Prepare Your Code

#### Frontend Preparation
1. Update your API base URL for production:
```bash
# Create production environment file
echo "REACT_APP_API_URL=https://your-backend-url.railway.app" > .env.production
```

#### Backend Preparation
1. Update your backend environment variables:
```bash
# In backend/.env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-url.netlify.app
DATABASE_URL=your-database-url
JWT_SECRET=your-super-secret-jwt-key
```

### Step 2: Deploy Backend to Railway

1. **Sign up for Railway**: Go to [railway.app](https://railway.app)
2. **Connect GitHub**: Link your GitHub account
3. **Create New Project**: 
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder as root directory
4. **Configure Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-app.netlify.app
   JWT_SECRET=your-super-secret-key-here
   ```
5. **Deploy**: Railway will automatically build and deploy

### Step 3: Deploy Frontend to Netlify

1. **Sign up for Netlify**: Go to [netlify.com](https://netlify.com)
2. **Connect GitHub**: Link your GitHub account
3. **Create New Site**:
   - Click "New site from Git"
   - Choose your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   ```
5. **Deploy**: Netlify will build and deploy automatically

### Step 4: Update CORS Settings

Update your backend CORS configuration with your actual frontend URL:
```javascript
// In backend/server.js
app.use(cors({
    origin: 'https://your-app.netlify.app',
    credentials: true
}));
```

## Option 2: Vercel (Alternative)

### Frontend + Backend on Vercel

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Create vercel.json**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/build/$1"
    }
  ]
}
```

3. **Deploy**:
```bash
vercel --prod
```

## Option 3: Heroku (Traditional)

### Backend on Heroku

1. **Install Heroku CLI**
2. **Create Heroku app**:
```bash
cd backend
heroku create your-app-name-api
```

3. **Set environment variables**:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
heroku config:set FRONTEND_URL=https://your-frontend-url
```

4. **Deploy**:
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Frontend on Netlify
Follow the Netlify steps from Option 1.

## Database Setup for Production

### Option A: Railway PostgreSQL
1. In Railway dashboard, click "New" → "Database" → "PostgreSQL"
2. Copy the connection string
3. Update your backend to use PostgreSQL instead of SQLite

### Option B: Supabase (Free PostgreSQL)
1. Sign up at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Update your backend configuration

## Environment Variables Summary

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

### Backend (.env)
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-url.netlify.app
DATABASE_URL=your-database-connection-string
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
```

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] CORS settings updated with production URLs
- [ ] Build process works locally (`npm run build`)
- [ ] All API endpoints tested
- [ ] SSL certificates configured (automatic with Netlify/Railway)
- [ ] Domain name configured (optional)

## Post-Deployment Steps

1. **Test all functionality**:
   - User registration/login
   - Job posting
   - Job applications
   - Admin functions
   - Payment processing

2. **Set up monitoring**:
   - Railway provides built-in monitoring
   - Netlify provides analytics
   - Consider adding error tracking (Sentry)

3. **Configure custom domain** (optional):
   - Add custom domain in Netlify/Railway dashboard
   - Update DNS settings

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check FRONTEND_URL in backend environment
   - Verify CORS configuration

2. **API Not Found**:
   - Check REACT_APP_API_URL in frontend
   - Verify backend deployment status

3. **Database Connection**:
   - Check DATABASE_URL format
   - Verify database is running

4. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

## Cost Estimates

### Free Tier (Recommended for testing)
- **Netlify**: Free (100GB bandwidth, 300 build minutes)
- **Railway**: Free ($5 credit monthly)
- **Total**: Free for small usage

### Paid Tier (For production)
- **Netlify Pro**: $19/month
- **Railway**: $5-20/month depending on usage
- **Total**: $24-39/month

## Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **HTTPS**: Ensure all connections use HTTPS
3. **JWT Secrets**: Use strong, unique secrets
4. **Database**: Use connection pooling and proper authentication
5. **Rate Limiting**: Already configured in your backend
6. **Input Validation**: Ensure all user inputs are validated

## Next Steps

1. Choose your deployment option
2. Set up accounts (Netlify, Railway, etc.)
3. Configure environment variables
4. Deploy backend first, then frontend
5. Test thoroughly
6. Set up monitoring and backups

Need help with any specific step? Let me know!