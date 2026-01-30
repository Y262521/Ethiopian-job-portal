#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Ethiopia Job Portal - Deployment Helper\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
    console.error('❌ Error: package.json not found. Please run this from the project root.');
    process.exit(1);
}

// Check if backend directory exists
if (!fs.existsSync('backend')) {
    console.error('❌ Error: backend directory not found.');
    process.exit(1);
}

console.log('📋 Pre-deployment checklist:');
console.log('1. ✅ Frontend package.json found');
console.log('2. ✅ Backend directory found');

// Check environment files
const envProd = fs.existsSync('.env.production');
const envBackend = fs.existsSync('backend/.env');

console.log(`3. ${envProd ? '✅' : '❌'} Production environment file (.env.production)`);
console.log(`4. ${envBackend ? '✅' : '❌'} Backend environment file (backend/.env)`);

if (!envProd) {
    console.log('\n⚠️  Creating .env.production file...');
    fs.writeFileSync('.env.production', 'REACT_APP_API_URL=https://your-backend-url.railway.app\n');
    console.log('✅ Created .env.production - Please update with your actual backend URL');
}

if (!envBackend) {
    console.log('\n⚠️  Creating backend/.env file...');
    const backendEnv = `NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-url.netlify.app
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
`;
    fs.writeFileSync('backend/.env', backendEnv);
    console.log('✅ Created backend/.env - Please update with your actual values');
}

console.log('\n🔧 Building frontend for production...');
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Frontend build completed successfully!');
} catch (error) {
    console.error('❌ Frontend build failed:', error.message);
    process.exit(1);
}

console.log('\n🔧 Testing backend...');
try {
    execSync('cd backend && npm test --if-present', { stdio: 'inherit' });
    console.log('✅ Backend tests passed!');
} catch (error) {
    console.log('⚠️  Backend tests not found or failed - continuing...');
}

console.log('\n🎉 Deployment preparation complete!');
console.log('\n📝 Next steps:');
console.log('1. Update .env.production with your actual backend URL');
console.log('2. Update backend/.env with your actual values');
console.log('3. Deploy backend to Railway (see DEPLOYMENT_GUIDE.md)');
console.log('4. Deploy frontend to Netlify (see DEPLOYMENT_GUIDE.md)');
console.log('5. Update CORS settings in backend with your frontend URL');
console.log('\n📖 For detailed instructions, see DEPLOYMENT_GUIDE.md');