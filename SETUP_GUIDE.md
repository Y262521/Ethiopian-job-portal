# Ethiopia Job Portal - Setup Guide

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

1. **Node.js** (version 14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/

4. **VS Code** (recommended editor)
   - Download from: https://code.visualstudio.com/

## 🚀 Quick Start

### Step 1: Download/Clone the Project

**Option A: If you have the project folder**
```bash
# Navigate to your project folder
cd path/to/ethiopia-job-portal
```

**Option B: If cloning from GitHub**
```bash
git clone https://github.com/your-username/ethiopia-job-portal.git
cd ethiopia-job-portal
```

### Step 2: Open in VS Code

```bash
# Open the project in VS Code
code .
```

Or manually:
1. Open VS Code
2. File → Open Folder
3. Select the project folder

### Step 3: Install Dependencies

Open VS Code terminal (`Ctrl + `` ` or View → Terminal) and run:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 4: Start the Application

You need to run both frontend and backend servers:

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
# or
node server.js
```

**Terminal 2 - Frontend Server:**
```bash
npm start
```

### Step 5: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 📁 Project Structure

```
ethiopia-job-portal/
├── backend/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── config/             # Database configuration
│   ├── uploads/            # File uploads
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env               # Backend environment variables
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── App.js             # Main app component
├── public/                 # Static files
├── package.json           # Frontend dependencies
├── .env                   # Frontend environment variables
└── README.md              # Project documentation
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

**Backend (backend/.env):**
```
PORT=5000
NODE_ENV=development
JWT_SECRET=ethiopia-job-super-secret-key-2024
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
```

## 👥 Default User Accounts

### Admin Account
- **Email:** admin@ethiopiajob.com
- **Password:** admin123456

### Test Employer Account
- **Email:** hr@ethiopianairlines.com
- **Password:** (Register new employer account)

### Test Job Seeker Account
- **Email:** (Register new job seeker account)
- **Password:** (Your chosen password)

## 🛠️ Development Commands

### Frontend Commands
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

### Backend Commands
```bash
cd backend
npm start          # Start backend server
node server.js     # Alternative start command
```

## 📱 Features Available

### For Job Seekers:
- ✅ User registration and login
- ✅ Browse and search jobs
- ✅ Apply for jobs with CV upload
- ✅ View application status
- ✅ User dashboard

### For Employers:
- ✅ Employer registration and login
- ✅ Post new jobs
- ✅ View job applications
- ✅ Manage application status
- ✅ Employer dashboard

### For Admins:
- ✅ Admin dashboard
- ✅ Manage payments
- ✅ Approve/reject applications
- ✅ System overview

## 🐛 Troubleshooting

### Common Issues:

**1. Port Already in Use**
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5000
npx kill-port 5000
```

**2. Dependencies Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**3. Database Issues**
```bash
# Delete database file and restart backend
cd backend
rm database.sqlite
node server.js
```

**4. CORS Issues**
- Make sure backend is running on port 5000
- Check .env files have correct URLs
- Restart both servers

### VS Code Extensions (Recommended):

1. **ES7+ React/Redux/React-Native snippets**
2. **Prettier - Code formatter**
3. **Auto Rename Tag**
4. **Bracket Pair Colorizer**
5. **GitLens**
6. **Thunder Client** (for API testing)

## 🔄 Development Workflow

1. **Start both servers** (backend and frontend)
2. **Make changes** to code
3. **Hot reload** will automatically refresh the browser
4. **Test features** in the browser
5. **Check console** for any errors

## 📦 Building for Production

### Frontend Build:
```bash
npm run build
```

### Backend Deployment:
```bash
cd backend
# Set NODE_ENV=production in .env
# Deploy to your hosting service
```

## 🆘 Getting Help

If you encounter issues:

1. **Check the console** for error messages
2. **Verify all dependencies** are installed
3. **Ensure both servers** are running
4. **Check port availability** (3000 and 5000)
5. **Review environment variables**

## 📞 Support

For additional support or questions about the Ethiopia Job Portal project, please check the documentation or create an issue in the project repository.

---

**Happy Coding! 🚀**